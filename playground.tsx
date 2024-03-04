import * as t from "io-ts";
import { useMeBus } from "./index";
import React from "react";
import type { EventSchema } from "mebus";

const a: t.TypeC<any> = t.type({
  groupId: t.string,
  stageId: t.string,
})

const eventSchema: Record<string, t.TypeC<any>> = {
  "sng:openCreateTestDialog": t.type({
    groupId: t.string,
    stageId: t.string,
  }),
  "monolith:testCreated": t.type({
    testId: t.string,
    stageId: t.string,
  }),

  "sng:openEvaluationDialog": t.type({
    scoreId: t.string,
  }),
  "monolith:scoreEvaluated": t.type({
    scoreId: t.string,
  }),

  "monolith:openAddTestToProjectDialog": t.type({
    testId: t.string,
  }),
  "sng:testAddedToProject": t.type({
    testId: t.string,
    project: t.type({
      id: t.string,
      name: t.string,
    }),
  }),
};

type event = typeof eventSchema['monolith:openAddTestToProjectDialog'];

const Component = () => {
  const publish = useMeBus({
    eventSchema: eventSchema,
    eventCallbacks: {
      "sng:openCreateTestDialog": ({ groupId, stageId }) => console.log(groupId, stageId),
      "monolith:testCreated": (payload) => console.log(payload),
    },
  });
  return (
    <button
      onClick={() =>
        publish("sng:openCreateTestDialog", { groupId: "foo", stageId: "bar" })
      }
    >
      Open Create Test Dialog
    </button>
  );
};
