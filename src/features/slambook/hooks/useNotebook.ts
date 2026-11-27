import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { NotebookAction, Person } from "../types";
import { notebookService } from "../services/notebookService";

export function useNotebook(account: Person, actorId: string) {
  const client = useQueryClient();
  const scope = ["slambook", account.id];
  const notebook = useQuery({
    queryKey: [...scope, "notebook", actorId],
    queryFn: () => notebookService.get(account, actorId),
  });
  const contacts = useQuery({
    queryKey: [...scope, "contacts", actorId],
    queryFn: () => notebookService.getConnections(account, actorId),
  });
  const change = useMutation({
    mutationFn: (action: NotebookAction) => notebookService.change(account, actorId, action),
    onSuccess: () => client.invalidateQueries({ queryKey: scope }),
  });
  return { notebook, contacts, change };
}
