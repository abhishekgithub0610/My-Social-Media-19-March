# Thinking IDE Backend Files

This is a copy-ready implementation guide for the .NET 8 API described in `ARCHITECTURE_API_SHORT.md`. The .NET repository is not the current workspace, so these files are not installed or compiled here. Keep the existing project namespaces as shown below.

The feature uses `IUserAccessor.GetUserId().ToString()` for ownership. No request or route accepts an authoritative user ID. Failure envelopes use the API's existing `ApiResponseResult<T>.Fail(ApiError)` convention.

## Files To Add

### `MySocialMedia.Domain/Entities/ThinkingSession.cs`

```csharp
namespace MySocialMedia.Domain.Entities;

public sealed class ThinkingSession
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string UserId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
    public DateTime UpdatedAtUtc { get; set; }
    public ICollection<ThinkingNode> Nodes { get; set; } = new List<ThinkingNode>();
}
```

### `MySocialMedia.Domain/Entities/ThinkingNode.cs`

```csharp
namespace MySocialMedia.Domain.Entities;

public enum ThinkingNodeKind
{
    Question = 0,
    Answer = 1
}

public enum ThinkingNodeStatus
{
    Open = 0,
    Resolved = 1
}

public sealed class ThinkingNode
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid SessionId { get; set; }
    public Guid? ParentId { get; set; }
    public ThinkingNodeKind Kind { get; set; }
    public ThinkingNodeStatus Status { get; set; } = ThinkingNodeStatus.Open;
    public string Content { get; set; } = string.Empty;
    public int? Score { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public DateTime UpdatedAtUtc { get; set; }
    public ThinkingSession Session { get; set; } = null!;
}
```

### `MySocialMedia.Application/Features/ThinkingSessions/ThinkingSessionContracts.cs`

```csharp
using MediatR;
using PandeyFurniture.Shared.Responses;

namespace MySocialMedia.Application.Features.ThinkingSessions;

public sealed record ThinkingSessionSummaryDto(
    Guid Id,
    string Title,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    int NodeCount);

public sealed record ThinkingNodeDto(
    Guid Id,
    Guid SessionId,
    Guid? ParentId,
    string Kind,
    string Content,
    string Status,
    int? Score,
    DateTime CreatedAt,
    DateTime UpdatedAt);

public sealed record ThinkingSessionDto(
    Guid Id,
    string Title,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    IReadOnlyList<ThinkingNodeDto> Nodes);

public sealed record ListThinkingSessionsQuery(string? Search)
    : IRequest<ApiResponseResult<IReadOnlyList<ThinkingSessionSummaryDto>>>;

public sealed record GetThinkingSessionQuery(Guid SessionId)
    : IRequest<ApiResponseResult<ThinkingSessionDto>>;

public sealed record CreateThinkingSessionCommand(
    string Title,
    string InitialQuestion)
    : IRequest<ApiResponseResult<ThinkingSessionSummaryDto>>;

public sealed record DeleteThinkingSessionCommand(Guid SessionId)
    : IRequest<ApiResponseResult>;

public sealed record AddThinkingNodeCommand
    : IRequest<ApiResponseResult<ThinkingNodeDto>>
{
    // The controller always overwrites SessionId from the route.
    public Guid SessionId { get; init; }
    public Guid ParentId { get; init; }
    public string Kind { get; init; } = string.Empty;
    public string Content { get; init; } = string.Empty;
}

public sealed record UpdateThinkingNodeCommand
    : IRequest<ApiResponseResult<ThinkingNodeDto>>
{
    // The controller always overwrites both IDs from the route.
    public Guid SessionId { get; init; }
    public Guid NodeId { get; init; }
    public string? Content { get; init; }
    public string? Status { get; init; }
}

public sealed record RateThinkingNodeCommand
    : IRequest<ApiResponseResult<ThinkingNodeDto>>
{
    // The controller always overwrites both IDs from the route.
    public Guid SessionId { get; init; }
    public Guid NodeId { get; init; }
    public int? Score { get; init; }
}
```

### `MySocialMedia.Application/Interfaces/Repositories/IThinkingSessionRepository.cs`

```csharp
using MySocialMedia.Application.Features.ThinkingSessions;
using MySocialMedia.Domain.Entities;

namespace MySocialMedia.Application.Interfaces.Repositories;

public interface IThinkingSessionRepository
{
    Task<IReadOnlyList<ThinkingSessionSummaryDto>> ListAsync(
        string userId,
        string? search,
        CancellationToken cancellationToken);

    Task<ThinkingSessionDto?> GetAsync(
        Guid sessionId,
        string userId,
        CancellationToken cancellationToken);

    Task<ThinkingSessionSummaryDto> CreateAsync(
        string userId,
        string title,
        string initialQuestion,
        CancellationToken cancellationToken);

    Task<bool> DeleteAsync(
        Guid sessionId,
        string userId,
        CancellationToken cancellationToken);

    Task<ThinkingNodeDto?> AddNodeAsync(
        Guid sessionId,
        string userId,
        Guid parentId,
        ThinkingNodeKind kind,
        string content,
        CancellationToken cancellationToken);

    Task<ThinkingNodeDto?> UpdateNodeAsync(
        Guid sessionId,
        string userId,
        Guid nodeId,
        string? content,
        ThinkingNodeStatus? status,
        CancellationToken cancellationToken);

    Task<ThinkingNodeDto?> RateNodeAsync(
        Guid sessionId,
        string userId,
        Guid nodeId,
        int? score,
        CancellationToken cancellationToken);
}
```

### `MySocialMedia.Application/Features/ThinkingSessions/ThinkingSessionHandlers.cs`

```csharp
using MediatR;
using MySocialMedia.Application.Interfaces.Repositories;
using MySocialMedia.Application.Interfaces.Services;
using MySocialMedia.Domain.Entities;
using PandeyFurniture.Shared.Responses;

namespace MySocialMedia.Application.Features.ThinkingSessions;

internal static class ThinkingSessionErrors
{
    public static ApiError NotFound => new(
        "Thinking.SessionNotFound",
        "The thinking session or thought was not found.");

    public static ApiError Invalid(string message) => new(
        "Thinking.InvalidInput",
        message);

    public static bool TryKind(string? value, out ThinkingNodeKind kind) =>
        Enum.TryParse(value, ignoreCase: true, out kind) && Enum.IsDefined(kind);

    public static bool TryStatus(string? value, out ThinkingNodeStatus status) =>
        Enum.TryParse(value, ignoreCase: true, out status) && Enum.IsDefined(status);
}

public sealed class ListThinkingSessionsHandler
    : IRequestHandler<ListThinkingSessionsQuery,
        ApiResponseResult<IReadOnlyList<ThinkingSessionSummaryDto>>>
{
    private readonly IThinkingSessionRepository _repository;
    private readonly IUserAccessor _userAccessor;

    public ListThinkingSessionsHandler(
        IThinkingSessionRepository repository,
        IUserAccessor userAccessor)
    {
        _repository = repository;
        _userAccessor = userAccessor;
    }

    public async Task<ApiResponseResult<IReadOnlyList<ThinkingSessionSummaryDto>>> Handle(
        ListThinkingSessionsQuery request,
        CancellationToken cancellationToken)
    {
        var sessions = await _repository.ListAsync(
            _userAccessor.GetUserId().ToString(),
            request.Search,
            cancellationToken);

        return ApiResponseResult<IReadOnlyList<ThinkingSessionSummaryDto>>.Success(sessions);
    }
}

public sealed class GetThinkingSessionHandler
    : IRequestHandler<GetThinkingSessionQuery, ApiResponseResult<ThinkingSessionDto>>
{
    private readonly IThinkingSessionRepository _repository;
    private readonly IUserAccessor _userAccessor;

    public GetThinkingSessionHandler(
        IThinkingSessionRepository repository,
        IUserAccessor userAccessor)
    {
        _repository = repository;
        _userAccessor = userAccessor;
    }

    public async Task<ApiResponseResult<ThinkingSessionDto>> Handle(
        GetThinkingSessionQuery request,
        CancellationToken cancellationToken)
    {
        var session = await _repository.GetAsync(
            request.SessionId,
            _userAccessor.GetUserId().ToString(),
            cancellationToken);

        return session is null
            ? ApiResponseResult<ThinkingSessionDto>.Fail(ThinkingSessionErrors.NotFound)
            : ApiResponseResult<ThinkingSessionDto>.Success(session);
    }
}

public sealed class CreateThinkingSessionHandler
    : IRequestHandler<CreateThinkingSessionCommand,
        ApiResponseResult<ThinkingSessionSummaryDto>>
{
    private readonly IThinkingSessionRepository _repository;
    private readonly IUserAccessor _userAccessor;

    public CreateThinkingSessionHandler(
        IThinkingSessionRepository repository,
        IUserAccessor userAccessor)
    {
        _repository = repository;
        _userAccessor = userAccessor;
    }

    public async Task<ApiResponseResult<ThinkingSessionSummaryDto>> Handle(
        CreateThinkingSessionCommand request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Title) || request.Title.Trim().Length > 120)
        {
            return ApiResponseResult<ThinkingSessionSummaryDto>.Fail(
                ThinkingSessionErrors.Invalid("Title is required and must be at most 120 characters."));
        }

        if (string.IsNullOrWhiteSpace(request.InitialQuestion) || request.InitialQuestion.Trim().Length > 5000)
        {
            return ApiResponseResult<ThinkingSessionSummaryDto>.Fail(
                ThinkingSessionErrors.Invalid("The initial question is required and must be at most 5000 characters."));
        }

        var session = await _repository.CreateAsync(
            _userAccessor.GetUserId().ToString(),
            request.Title.Trim(),
            request.InitialQuestion.Trim(),
            cancellationToken);

        return ApiResponseResult<ThinkingSessionSummaryDto>.Success(session);
    }
}

public sealed class DeleteThinkingSessionHandler
    : IRequestHandler<DeleteThinkingSessionCommand, ApiResponseResult>
{
    private readonly IThinkingSessionRepository _repository;
    private readonly IUserAccessor _userAccessor;

    public DeleteThinkingSessionHandler(
        IThinkingSessionRepository repository,
        IUserAccessor userAccessor)
    {
        _repository = repository;
        _userAccessor = userAccessor;
    }

    public async Task<ApiResponseResult> Handle(
        DeleteThinkingSessionCommand request,
        CancellationToken cancellationToken)
    {
        var deleted = await _repository.DeleteAsync(
            request.SessionId,
            _userAccessor.GetUserId().ToString(),
            cancellationToken);

        return deleted
            ? ApiResponseResult.Success("Session deleted.")
            : ApiResponseResult.Fail(ThinkingSessionErrors.NotFound);
    }
}

public sealed class AddThinkingNodeHandler
    : IRequestHandler<AddThinkingNodeCommand, ApiResponseResult<ThinkingNodeDto>>
{
    private readonly IThinkingSessionRepository _repository;
    private readonly IUserAccessor _userAccessor;

    public AddThinkingNodeHandler(
        IThinkingSessionRepository repository,
        IUserAccessor userAccessor)
    {
        _repository = repository;
        _userAccessor = userAccessor;
    }

    public async Task<ApiResponseResult<ThinkingNodeDto>> Handle(
        AddThinkingNodeCommand request,
        CancellationToken cancellationToken)
    {
        if (request.SessionId == Guid.Empty || request.ParentId == Guid.Empty)
        {
            return ApiResponseResult<ThinkingNodeDto>.Fail(
                ThinkingSessionErrors.Invalid("A valid session and parent thought are required."));
        }

        if (!ThinkingSessionErrors.TryKind(request.Kind, out var kind))
        {
            return ApiResponseResult<ThinkingNodeDto>.Fail(
                ThinkingSessionErrors.Invalid("Kind must be Question or Answer."));
        }

        if (string.IsNullOrWhiteSpace(request.Content) || request.Content.Trim().Length > 5000)
        {
            return ApiResponseResult<ThinkingNodeDto>.Fail(
                ThinkingSessionErrors.Invalid("Content is required and must be at most 5000 characters."));
        }

        var node = await _repository.AddNodeAsync(
            request.SessionId,
            _userAccessor.GetUserId().ToString(),
            request.ParentId,
            kind,
            request.Content.Trim(),
            cancellationToken);

        return node is null
            ? ApiResponseResult<ThinkingNodeDto>.Fail(ThinkingSessionErrors.NotFound)
            : ApiResponseResult<ThinkingNodeDto>.Success(node);
    }
}

public sealed class UpdateThinkingNodeHandler
    : IRequestHandler<UpdateThinkingNodeCommand, ApiResponseResult<ThinkingNodeDto>>
{
    private readonly IThinkingSessionRepository _repository;
    private readonly IUserAccessor _userAccessor;

    public UpdateThinkingNodeHandler(
        IThinkingSessionRepository repository,
        IUserAccessor userAccessor)
    {
        _repository = repository;
        _userAccessor = userAccessor;
    }

    public async Task<ApiResponseResult<ThinkingNodeDto>> Handle(
        UpdateThinkingNodeCommand request,
        CancellationToken cancellationToken)
    {
        if (request.SessionId == Guid.Empty || request.NodeId == Guid.Empty ||
            (request.Content is null && request.Status is null))
        {
            return ApiResponseResult<ThinkingNodeDto>.Fail(
                ThinkingSessionErrors.Invalid("Provide content or status for a valid thought."));
        }

        if (request.Content is not null &&
            (string.IsNullOrWhiteSpace(request.Content) || request.Content.Trim().Length > 5000))
        {
            return ApiResponseResult<ThinkingNodeDto>.Fail(
                ThinkingSessionErrors.Invalid("Content is required and must be at most 5000 characters."));
        }

        ThinkingNodeStatus? status = null;
        if (request.Status is not null)
        {
            if (!ThinkingSessionErrors.TryStatus(request.Status, out var parsedStatus))
            {
                return ApiResponseResult<ThinkingNodeDto>.Fail(
                    ThinkingSessionErrors.Invalid("Status must be Open or Resolved."));
            }

            status = parsedStatus;
        }

        var node = await _repository.UpdateNodeAsync(
            request.SessionId,
            _userAccessor.GetUserId().ToString(),
            request.NodeId,
            request.Content?.Trim(),
            status,
            cancellationToken);

        return node is null
            ? ApiResponseResult<ThinkingNodeDto>.Fail(ThinkingSessionErrors.NotFound)
            : ApiResponseResult<ThinkingNodeDto>.Success(node);
    }
}

public sealed class RateThinkingNodeHandler
    : IRequestHandler<RateThinkingNodeCommand, ApiResponseResult<ThinkingNodeDto>>
{
    private readonly IThinkingSessionRepository _repository;
    private readonly IUserAccessor _userAccessor;

    public RateThinkingNodeHandler(
        IThinkingSessionRepository repository,
        IUserAccessor userAccessor)
    {
        _repository = repository;
        _userAccessor = userAccessor;
    }

    public async Task<ApiResponseResult<ThinkingNodeDto>> Handle(
        RateThinkingNodeCommand request,
        CancellationToken cancellationToken)
    {
        if (request.SessionId == Guid.Empty || request.NodeId == Guid.Empty ||
            request.Score is < 0 or > 10)
        {
            return ApiResponseResult<ThinkingNodeDto>.Fail(
                ThinkingSessionErrors.Invalid("Score must be null or a whole number from 0 to 10."));
        }

        var node = await _repository.RateNodeAsync(
            request.SessionId,
            _userAccessor.GetUserId().ToString(),
            request.NodeId,
            request.Score,
            cancellationToken);

        return node is null
            ? ApiResponseResult<ThinkingNodeDto>.Fail(ThinkingSessionErrors.NotFound)
            : ApiResponseResult<ThinkingNodeDto>.Success(node);
    }
}
```

### `MySocialMedia.Persistence/Repositories/ThinkingSessionRepository.cs`

```csharp
using Microsoft.EntityFrameworkCore;
using MySocialMedia.Application.Features.ThinkingSessions;
using MySocialMedia.Application.Interfaces.Repositories;
using MySocialMedia.Domain.Entities;
using PandeyFurniture.Persistence.Data;

namespace MySocialMedia.Persistence.Repositories;

public sealed class ThinkingSessionRepository : IThinkingSessionRepository
{
    private readonly ApplicationDbContext _db;

    public ThinkingSessionRepository(ApplicationDbContext db) => _db = db;

    public async Task<IReadOnlyList<ThinkingSessionSummaryDto>> ListAsync(
        string userId,
        string? search,
        CancellationToken cancellationToken)
    {
        var query = _db.ThinkingSessions
            .AsNoTracking()
            .Where(session => session.UserId == userId);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(session => session.Title.Contains(term));
        }

        return await query
            .OrderByDescending(session => session.UpdatedAtUtc)
            .ThenBy(session => session.Id)
            .Select(session => new ThinkingSessionSummaryDto(
                session.Id,
                session.Title,
                session.CreatedAtUtc,
                session.UpdatedAtUtc,
                session.Nodes.Count))
            .ToListAsync(cancellationToken);
    }

    public async Task<ThinkingSessionDto?> GetAsync(
        Guid sessionId,
        string userId,
        CancellationToken cancellationToken)
    {
        var session = await _db.ThinkingSessions
            .AsNoTracking()
            .Where(item => item.Id == sessionId && item.UserId == userId)
            .Select(item => new
            {
                item.Id,
                item.Title,
                item.CreatedAtUtc,
                item.UpdatedAtUtc
            })
            .SingleOrDefaultAsync(cancellationToken);

        if (session is null)
            return null;

        var nodes = await _db.ThinkingNodes
            .AsNoTracking()
            .Where(node => node.SessionId == sessionId)
            .OrderBy(node => node.CreatedAtUtc)
            .ThenBy(node => node.Id)
            .ToListAsync(cancellationToken);

        return new ThinkingSessionDto(
            session.Id,
            session.Title,
            session.CreatedAtUtc,
            session.UpdatedAtUtc,
            nodes.Select(ToDto).ToList());
    }

    public async Task<ThinkingSessionSummaryDto> CreateAsync(
        string userId,
        string title,
        string initialQuestion,
        CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var session = new ThinkingSession
        {
            UserId = userId,
            Title = title,
            CreatedAtUtc = now,
            UpdatedAtUtc = now
        };
        var firstNode = new ThinkingNode
        {
            SessionId = session.Id,
            ParentId = null,
            Kind = ThinkingNodeKind.Question,
            Status = ThinkingNodeStatus.Open,
            Content = initialQuestion,
            CreatedAtUtc = now,
            UpdatedAtUtc = now
        };

        _db.ThinkingSessions.Add(session);
        _db.ThinkingNodes.Add(firstNode);
        await _db.SaveChangesAsync(cancellationToken);

        return new ThinkingSessionSummaryDto(
            session.Id,
            session.Title,
            session.CreatedAtUtc,
            session.UpdatedAtUtc,
            1);
    }

    public async Task<bool> DeleteAsync(
        Guid sessionId,
        string userId,
        CancellationToken cancellationToken)
    {
        var session = await _db.ThinkingSessions
            .SingleOrDefaultAsync(
                item => item.Id == sessionId && item.UserId == userId,
                cancellationToken);

        if (session is null)
            return false;

        _db.ThinkingSessions.Remove(session);
        await _db.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<ThinkingNodeDto?> AddNodeAsync(
        Guid sessionId,
        string userId,
        Guid parentId,
        ThinkingNodeKind kind,
        string content,
        CancellationToken cancellationToken)
    {
        var session = await _db.ThinkingSessions
            .SingleOrDefaultAsync(
                item => item.Id == sessionId && item.UserId == userId,
                cancellationToken);

        if (session is null)
            return null;

        // Parent lookup includes SessionId, so cross-session parent IDs cannot be used.
        var parentExists = await _db.ThinkingNodes
            .AnyAsync(
                node => node.Id == parentId && node.SessionId == sessionId,
                cancellationToken);

        if (!parentExists)
            return null;

        var now = DateTime.UtcNow;
        var node = new ThinkingNode
        {
            SessionId = sessionId,
            ParentId = parentId,
            Kind = kind,
            Status = ThinkingNodeStatus.Open,
            Content = content,
            CreatedAtUtc = now,
            UpdatedAtUtc = now
        };

        session.UpdatedAtUtc = now;
        _db.ThinkingNodes.Add(node);
        await _db.SaveChangesAsync(cancellationToken);
        return ToDto(node);
    }

    public async Task<ThinkingNodeDto?> UpdateNodeAsync(
        Guid sessionId,
        string userId,
        Guid nodeId,
        string? content,
        ThinkingNodeStatus? status,
        CancellationToken cancellationToken)
    {
        var node = await _db.ThinkingNodes
            .Include(item => item.Session)
            .SingleOrDefaultAsync(
                item => item.Id == nodeId &&
                        item.SessionId == sessionId &&
                        item.Session.UserId == userId,
                cancellationToken);

        if (node is null)
            return null;

        var now = DateTime.UtcNow;
        if (content is not null)
            node.Content = content;
        if (status.HasValue)
            node.Status = status.Value;

        node.UpdatedAtUtc = now;
        node.Session.UpdatedAtUtc = now;
        await _db.SaveChangesAsync(cancellationToken);
        return ToDto(node);
    }

    public async Task<ThinkingNodeDto?> RateNodeAsync(
        Guid sessionId,
        string userId,
        Guid nodeId,
        int? score,
        CancellationToken cancellationToken)
    {
        var node = await _db.ThinkingNodes
            .Include(item => item.Session)
            .SingleOrDefaultAsync(
                item => item.Id == nodeId &&
                        item.SessionId == sessionId &&
                        item.Session.UserId == userId,
                cancellationToken);

        if (node is null)
            return null;

        var now = DateTime.UtcNow;
        node.Score = score;
        node.UpdatedAtUtc = now;
        node.Session.UpdatedAtUtc = now;
        await _db.SaveChangesAsync(cancellationToken);
        return ToDto(node);
    }

    private static ThinkingNodeDto ToDto(ThinkingNode node) => new(
        node.Id,
        node.SessionId,
        node.ParentId,
        node.Kind.ToString().ToLowerInvariant(),
        node.Content,
        node.Status.ToString().ToLowerInvariant(),
        node.Score,
        node.CreatedAtUtc,
        node.UpdatedAtUtc);
}
```

## Controller

### `MySocialMedia.Api/Controllers/ThinkingSessionsController.cs`

```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MySocialMedia.Application.Features.ThinkingSessions;

namespace MySocialMedia.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/thinking/sessions")]
public sealed class ThinkingSessionsController : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> List(
        [FromQuery] string? search,
        CancellationToken cancellationToken) =>
        HandleResult(await Mediator.Send(
            new ListThinkingSessionsQuery(search), cancellationToken));

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateThinkingSessionCommand command,
        CancellationToken cancellationToken) =>
        HandleResult(await Mediator.Send(command, cancellationToken));

    [HttpGet("{sessionId:guid}")]
    public async Task<IActionResult> Get(
        Guid sessionId,
        CancellationToken cancellationToken) =>
        HandleResult(await Mediator.Send(
            new GetThinkingSessionQuery(sessionId), cancellationToken));

    [HttpDelete("{sessionId:guid}")]
    public async Task<IActionResult> Delete(
        Guid sessionId,
        CancellationToken cancellationToken) =>
        HandleResult(await Mediator.Send(
            new DeleteThinkingSessionCommand(sessionId), cancellationToken));

    [HttpPost("{sessionId:guid}/nodes")]
    public async Task<IActionResult> AddNode(
        Guid sessionId,
        [FromBody] AddThinkingNodeCommand command,
        CancellationToken cancellationToken) =>
        HandleResult(await Mediator.Send(
            command with { SessionId = sessionId }, cancellationToken));

    [HttpPatch("{sessionId:guid}/nodes/{nodeId:guid}")]
    public async Task<IActionResult> UpdateNode(
        Guid sessionId,
        Guid nodeId,
        [FromBody] UpdateThinkingNodeCommand command,
        CancellationToken cancellationToken) =>
        HandleResult(await Mediator.Send(
            command with { SessionId = sessionId, NodeId = nodeId }, cancellationToken));

    [HttpPut("{sessionId:guid}/nodes/{nodeId:guid}/rating")]
    public async Task<IActionResult> RateNode(
        Guid sessionId,
        Guid nodeId,
        [FromBody] RateThinkingNodeCommand command,
        CancellationToken cancellationToken) =>
        HandleResult(await Mediator.Send(
            command with { SessionId = sessionId, NodeId = nodeId }, cancellationToken));
}
```

The route IDs overwrite any corresponding body properties. Ownership always comes from `IUserAccessor` in the handlers and every repository query is owner-scoped. Unknown and other users' IDs return the same error to avoid disclosing resource existence.

## EF Core Integration

### `MySocialMedia.Persistence/Data/ApplicationDbContext.cs`

Add these properties inside `ApplicationDbContext`:

```csharp
public DbSet<ThinkingSession> ThinkingSessions { get; set; }
    = null!;
public DbSet<ThinkingNode> ThinkingNodes { get; set; }
    = null!;
```

Add the following configuration inside `OnModelCreating`, after the existing `base.OnModelCreating(builder)` call. Keep all existing model configuration intact.

```csharp
builder.Entity<ThinkingSession>(entity =>
{
    entity.ToTable("ThinkingSessions");
    entity.HasKey(item => item.Id);
    entity.Property(item => item.UserId).HasMaxLength(450).IsRequired();
    entity.Property(item => item.Title).HasMaxLength(120).IsRequired();
    entity.Property(item => item.CreatedAtUtc).IsRequired();
    entity.Property(item => item.UpdatedAtUtc).IsRequired();
    entity.HasIndex(item => new { item.UserId, item.UpdatedAtUtc });
    entity.HasIndex(item => new { item.UserId, item.Title });

    entity.HasOne<ApplicationUser>()
        .WithMany()
        .HasForeignKey(item => item.UserId)
        .OnDelete(DeleteBehavior.Cascade);
});

builder.Entity<ThinkingNode>(entity =>
{
    entity.ToTable("ThinkingNodes", table =>
    {
        table.HasCheckConstraint(
            "CK_ThinkingNodes_Score",
            "[Score] IS NULL OR ([Score] >= 0 AND [Score] <= 10)");
        table.HasCheckConstraint(
            "CK_ThinkingNodes_Kind",
            "[Kind] IN ('Question', 'Answer')");
        table.HasCheckConstraint(
            "CK_ThinkingNodes_Status",
            "[Status] IN ('Open', 'Resolved')");
    });

    entity.HasKey(item => item.Id);
    entity.Property(item => item.Content).HasMaxLength(5000).IsRequired();
    entity.Property(item => item.Kind).HasConversion<string>().HasMaxLength(16);
    entity.Property(item => item.Status).HasConversion<string>().HasMaxLength(16);
    entity.Property(item => item.Score);
    entity.Property(item => item.CreatedAtUtc).IsRequired();
    entity.Property(item => item.UpdatedAtUtc).IsRequired();
    entity.HasIndex(item => new { item.SessionId, item.ParentId });
    entity.HasIndex(item => new { item.SessionId, item.UpdatedAtUtc });

    entity.HasOne(item => item.Session)
        .WithMany(session => session.Nodes)
        .HasForeignKey(item => item.SessionId)
        .OnDelete(DeleteBehavior.Cascade);

    // Composite self-FK prevents a node from referencing a parent in another session.
    entity.HasAlternateKey(item => new { item.SessionId, item.Id });
    entity.HasOne<ThinkingNode>()
        .WithMany()
        .HasForeignKey(item => new { item.SessionId, item.ParentId })
        .HasPrincipalKey(item => new { item.SessionId, item.Id })
        .OnDelete(DeleteBehavior.Restrict);
});
```

Add these usings if they are not already present:

```csharp
using MySocialMedia.Domain.Entities;
using PandeyFurniture.Domain.Entities;
```

The composite self-FK and owner-scoped parent lookup both enforce same-session branching. The two tables are additive; this does not alter existing social tables.

## Dependency Injection

In `MySocialMedia.Api/Extensions/InfrastructureServiceCollectionExtensions.cs`, add the repository registration alongside the existing registrations (the relevant namespaces are already imported in the architecture snapshot):

```csharp
services.AddScoped<IThinkingSessionRepository, ThinkingSessionRepository>();
```

No MediatR registration change is needed: `Program.cs` already scans the Application assembly. This implementation validates at the handler boundary, so it does not require a new FluentValidation registration.

## Migration And Verification

From the API solution root, after adding the entity/context code, generate the migration rather than hand-editing the model snapshot:

```powershell
dotnet ef migrations add AddThinkingSessions --project MySocialMedia.Persistence --startup-project MySocialMedia.Api
dotnet ef database update --project MySocialMedia.Persistence --startup-project MySocialMedia.Api
```

Review the generated migration before applying it to shared/production SQL Server. It should only create `ThinkingSessions` and `ThinkingNodes`, their indexes, check constraints, and foreign keys. Use the project's normal deployment migration process for production.

The frontend endpoints in `src/features/thinking-ide/services/thinkingApi.ts` map directly to the controller above. Before connecting production data, test authenticated ownership isolation, cross-session parent rejection, score null/0/10/out-of-range behavior, content and status edits preserving scores, and session activity ordering.
