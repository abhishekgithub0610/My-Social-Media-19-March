import { Form, Stack } from "react-bootstrap";
import type { Answers, Question } from "../types";
import { hasAnswer } from "../validation";
import styles from "./slambook.module.css";

export function QuestionFields({ questions, answers, onAnswer }: {
  questions: Question[];
  answers: Answers;
  onAnswer?: (id: string, value: Answers[string]) => void;
}) {
  return <Stack gap={3}>{questions.map((question, index) => {
    const id = `question-${question.id}`;
    const value = answers[question.id];
    const selected = Array.isArray(value) ? value : [];
    const choices = question.type === "rating" ? ["1", "2", "3", "4", "5"] : question.options;
    const textControl = {
      "aria-labelledby": id,
      value: typeof value === "string" ? value : "",
      onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        onAnswer?.(question.id, event.target.value),
    };
    return <fieldset disabled={!onAnswer} key={id}>
      <legend className="fs-6" id={id}>{index + 1}. {question.prompt || "Untitled question"} <small className="text-body-secondary">({question.required ? "required" : "optional"})</small></legend>
      {question.type === "short" ? <Form.Control {...textControl} maxLength={250} /> :
        question.type === "long" ? <Form.Control as="textarea" {...textControl} rows={3} maxLength={4000} /> : <>
        <div className={question.type === "rating" ? "d-flex flex-wrap gap-3" : ""}>
          {choices.map((option, choice) => <Form.Check key={choice} id={`${id}-${choice}`} name={id} label={option}
            type={question.type === "multiple" ? "checkbox" : "radio"}
            checked={question.type === "multiple" ? selected.includes(option) : value === option}
            onChange={(e) => onAnswer?.(question.id, question.type === "multiple"
              ? e.target.checked ? [...selected, option] : selected.filter((entry) => entry !== option)
              : option)} />)}
        </div>
        {onAnswer && question.type !== "multiple" && !question.required && hasAnswer(value) &&
          <button className="btn btn-link btn-sm p-0" type="button" onClick={() => onAnswer(question.id, "")}>Clear answer</button>}
      </>}
    </fieldset>;
  })}</Stack>;
}

export function AnswerPages({ questions, answers }: { questions: Question[]; answers: Answers }) {
  return <dl className={styles.pages}>{questions.map(({ id, prompt, type }) => {
    const answer = answers[id];
    return <div key={id}><dt>{prompt}</dt><dd>
      {hasAnswer(answer) ? Array.isArray(answer) ? answer.join(", ") : type === "rating" ? `${answer} / 5` : answer : "Skipped"}
    </dd></div>;
  })}</dl>;
}
