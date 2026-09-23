"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getInterests,
  getMyInterests,
  saveMyInterests,
} from "@/features/interests/services/interestApi";

const MAX_INTERESTS = 20;

export default function InterestsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [hasLoadedSelection, setHasLoadedSelection] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    data: interestsResponse,
    isLoading: isLoadingInterests,
    isError: interestsError,
  } = useQuery({
    queryKey: ["interests", "catalog"],
    queryFn: getInterests,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: myInterestsResponse,
    isLoading: isLoadingMyInterests,
    isError: myInterestsError,
  } = useQuery({
    queryKey: ["interests", "me"],
    queryFn: getMyInterests,
    staleTime: 60 * 1000,
  });

  const interests = interestsResponse?.result ?? [];
  const myInterests = myInterestsResponse?.result;

  useEffect(() => {
    if (!hasLoadedSelection && myInterests) {
      setSelectedIds(myInterests.interestIds);
      setHasLoadedSelection(true);
    }
  }, [myInterests, hasLoadedSelection]);

  const saveMutation = useMutation({
    mutationFn: saveMyInterests,

    onSuccess: async (response) => {
      if (!response.result) {
        setErrorMessage("Your interests could not be saved.");
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: ["interests", "me"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["suggested-pages"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["suggested-posts"],
      });

      router.replace("/feed");
    },

    onError: () => {
      setErrorMessage("Your interests could not be saved. Please try again.");
    },
  });

  const toggleInterest = (id: string) => {
    setErrorMessage("");

    setSelectedIds((current) => {
      if (current.includes(id)) {
        return current.filter((selectedId) => selectedId !== id);
      }

      if (current.length >= MAX_INTERESTS) {
        setErrorMessage(
          `You can choose up to ${MAX_INTERESTS} interests.`,
        );
        return current;
      }

      return [...current, id];
    });
  };

  const handleContinue = () => {
    if (selectedIds.length === 0) {
      setErrorMessage("Choose an interest, or select Skip for now.");
      return;
    }

    setErrorMessage("");
    saveMutation.mutate(selectedIds);
  };

  const handleSkip = () => {
    setErrorMessage("");

    // Empty array means Skip. The API still marks onboarding complete.
    saveMutation.mutate([]);
  };

  if (isLoadingInterests || isLoadingMyInterests) {
    return (
      <div className="container py-5 text-center">
        Loading interests...
      </div>
    );
  }

  if (interestsError || myInterestsError) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          We could not load your interests. Please refresh and try again.
        </div>
      </div>
    );
  }

  return (
    <main className="container py-5" style={{ maxWidth: 850 }}>
      <div className="text-center mb-4">
        <h1 className="h2">What are you interested in?</h1>

        <p className="text-muted">
          Choose topics you like. We will use them to suggest pages and
          content. You can change these choices later in Settings.
        </p>
      </div>

      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

      <div
        className="d-flex flex-wrap justify-content-center gap-2 mb-4"
        role="group"
        aria-label="Choose interests"
      >
        {interests.map((interest) => {
          const isSelected = selectedIds.includes(interest.id);

          return (
            <button
              key={interest.id}
              type="button"
              aria-pressed={isSelected}
              disabled={saveMutation.isPending}
              className={
                isSelected
                  ? "btn btn-primary rounded-pill"
                  : "btn btn-outline-secondary rounded-pill"
              }
              onClick={() => toggleInterest(interest.id)}
            >
              {interest.name}
            </button>
          );
        })}
      </div>

      <p className="text-center text-muted small">
        {selectedIds.length} of {MAX_INTERESTS} selected
      </p>

      <div className="d-flex justify-content-center gap-3">
        <button
          type="button"
          className="btn btn-primary"
          disabled={saveMutation.isPending || selectedIds.length === 0}
          onClick={handleContinue}
        >
          {saveMutation.isPending ? "Saving..." : "Continue"}
        </button>

        <button
          type="button"
          className="btn btn-link"
          disabled={saveMutation.isPending}
          onClick={handleSkip}
        >
          Skip for now
        </button>
      </div>
    </main>
  );
}