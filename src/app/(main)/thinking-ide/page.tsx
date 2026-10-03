import type { Metadata } from "next";
import { Container } from "react-bootstrap";
import ThinkingWorkspace from "@/features/thinking-ide/components/ThinkingWorkspace";

export const metadata: Metadata = { title: "Thinking IDE" };

export default function ThinkingIdePage() {
  return (
    <Container fluid className="py-4 px-3 px-xl-4">
      <ThinkingWorkspace />
    </Container>
  );
}
