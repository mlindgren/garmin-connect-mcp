import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// ── Workout Templates (MCP Resources) ──────────────────────────────────────
// Templates adapted from Taxuspt/garmin_mcp (MIT License, Copyright (c) 2025 Alexandre Domingues)
// https://github.com/Taxuspt/garmin_mcp/blob/main/src/garmin_mcp/workout_templates.py

const WORKOUT_TEMPLATES: Record<string, unknown> = {
  "simple-run": {
    workoutName: "Simple Run",
    sportType: { sportTypeId: 1, sportTypeKey: "running" },
    workoutSegments: [
      {
        segmentOrder: 1,
        sportType: { sportTypeId: 1, sportTypeKey: "running" },
        workoutSteps: [
          {
            type: "ExecutableStepDTO",
            stepOrder: 1,
            stepType: { stepTypeId: 1, stepTypeKey: "warmup" },
            endCondition: { conditionTypeId: 2, conditionTypeKey: "time" },
            endConditionValue: 300.0,
            targetType: {
              workoutTargetTypeId: 1,
              workoutTargetTypeKey: "no.target",
            },
          },
          {
            type: "ExecutableStepDTO",
            stepOrder: 2,
            stepType: { stepTypeId: 3, stepTypeKey: "interval" },
            endCondition: { conditionTypeId: 2, conditionTypeKey: "time" },
            endConditionValue: 1800.0,
            targetType: {
              workoutTargetTypeId: 1,
              workoutTargetTypeKey: "no.target",
            },
          },
          {
            type: "ExecutableStepDTO",
            stepOrder: 3,
            stepType: { stepTypeId: 2, stepTypeKey: "cooldown" },
            endCondition: { conditionTypeId: 2, conditionTypeKey: "time" },
            endConditionValue: 300.0,
            targetType: {
              workoutTargetTypeId: 1,
              workoutTargetTypeKey: "no.target",
            },
          },
        ],
      },
    ],
  },

  "interval-running": {
    workoutName: "Interval Running",
    sportType: { sportTypeId: 1, sportTypeKey: "running" },
    workoutSegments: [
      {
        segmentOrder: 1,
        sportType: { sportTypeId: 1, sportTypeKey: "running" },
        workoutSteps: [
          {
            type: "ExecutableStepDTO",
            stepOrder: 1,
            stepType: { stepTypeId: 1, stepTypeKey: "warmup" },
            endCondition: { conditionTypeId: 2, conditionTypeKey: "time" },
            endConditionValue: 600.0,
            targetType: {
              workoutTargetTypeId: 1,
              workoutTargetTypeKey: "no.target",
            },
          },
          {
            type: "RepeatGroupDTO",
            stepOrder: 2,
            numberOfIterations: 6,
            workoutSteps: [
              {
                type: "ExecutableStepDTO",
                stepOrder: 1,
                stepType: { stepTypeId: 3, stepTypeKey: "interval" },
                endCondition: { conditionTypeId: 2, conditionTypeKey: "time" },
                endConditionValue: 60.0,
                targetType: {
                  workoutTargetTypeId: 4,
                  workoutTargetTypeKey: "heart.rate.zone",
                },
                zoneNumber: 5,
              },
              {
                type: "ExecutableStepDTO",
                stepOrder: 2,
                stepType: { stepTypeId: 4, stepTypeKey: "recovery" },
                endCondition: { conditionTypeId: 2, conditionTypeKey: "time" },
                endConditionValue: 90.0,
                targetType: {
                  workoutTargetTypeId: 4,
                  workoutTargetTypeKey: "heart.rate.zone",
                },
                zoneNumber: 2,
              },
            ],
          },
          {
            type: "ExecutableStepDTO",
            stepOrder: 3,
            stepType: { stepTypeId: 2, stepTypeKey: "cooldown" },
            endCondition: { conditionTypeId: 2, conditionTypeKey: "time" },
            endConditionValue: 600.0,
            targetType: {
              workoutTargetTypeId: 1,
              workoutTargetTypeKey: "no.target",
            },
          },
        ],
      },
    ],
  },

  "tempo-run": {
    workoutName: "Tempo Run",
    sportType: { sportTypeId: 1, sportTypeKey: "running" },
    workoutSegments: [
      {
        segmentOrder: 1,
        sportType: { sportTypeId: 1, sportTypeKey: "running" },
        workoutSteps: [
          {
            type: "ExecutableStepDTO",
            stepOrder: 1,
            stepType: { stepTypeId: 1, stepTypeKey: "warmup" },
            endCondition: { conditionTypeId: 2, conditionTypeKey: "time" },
            endConditionValue: 600.0,
            targetType: {
              workoutTargetTypeId: 4,
              workoutTargetTypeKey: "heart.rate.zone",
            },
            zoneNumber: 2,
          },
          {
            type: "ExecutableStepDTO",
            stepOrder: 2,
            stepType: { stepTypeId: 3, stepTypeKey: "interval" },
            endCondition: { conditionTypeId: 2, conditionTypeKey: "time" },
            endConditionValue: 1200.0,
            targetType: {
              workoutTargetTypeId: 4,
              workoutTargetTypeKey: "heart.rate.zone",
            },
            zoneNumber: 4,
          },
          {
            type: "ExecutableStepDTO",
            stepOrder: 3,
            stepType: { stepTypeId: 2, stepTypeKey: "cooldown" },
            endCondition: { conditionTypeId: 2, conditionTypeKey: "time" },
            endConditionValue: 600.0,
            targetType: {
              workoutTargetTypeId: 4,
              workoutTargetTypeKey: "heart.rate.zone",
            },
            zoneNumber: 2,
          },
        ],
      },
    ],
  },

  "strength-circuit": {
    workoutName: "Strength Circuit",
    sportType: { sportTypeId: 6, sportTypeKey: "fitness_equipment" },
    workoutSegments: [
      {
        segmentOrder: 1,
        sportType: { sportTypeId: 6, sportTypeKey: "fitness_equipment" },
        workoutSteps: [
          {
            type: "ExecutableStepDTO",
            stepOrder: 1,
            stepType: { stepTypeId: 1, stepTypeKey: "warmup" },
            endCondition: { conditionTypeId: 2, conditionTypeKey: "time" },
            endConditionValue: 300.0,
            targetType: {
              workoutTargetTypeId: 1,
              workoutTargetTypeKey: "no.target",
            },
          },
          {
            type: "RepeatGroupDTO",
            stepOrder: 2,
            numberOfIterations: 3,
            workoutSteps: [
              {
                type: "ExecutableStepDTO",
                stepOrder: 1,
                stepType: { stepTypeId: 3, stepTypeKey: "interval" },
                endCondition: { conditionTypeId: 2, conditionTypeKey: "time" },
                endConditionValue: 40.0,
                targetType: {
                  workoutTargetTypeId: 1,
                  workoutTargetTypeKey: "no.target",
                },
                description: "Exercise (e.g. push-ups, squats, rows)",
              },
              {
                type: "ExecutableStepDTO",
                stepOrder: 2,
                stepType: { stepTypeId: 5, stepTypeKey: "rest" },
                endCondition: { conditionTypeId: 2, conditionTypeKey: "time" },
                endConditionValue: 20.0,
                targetType: {
                  workoutTargetTypeId: 1,
                  workoutTargetTypeKey: "no.target",
                },
              },
            ],
          },
          {
            type: "ExecutableStepDTO",
            stepOrder: 3,
            stepType: { stepTypeId: 2, stepTypeKey: "cooldown" },
            endCondition: { conditionTypeId: 2, conditionTypeKey: "time" },
            endConditionValue: 300.0,
            targetType: {
              workoutTargetTypeId: 1,
              workoutTargetTypeKey: "no.target",
            },
          },
        ],
      },
    ],
  },
};

const WORKOUT_STRUCTURE_REFERENCE = `# Garmin Connect Workout JSON Structure Reference

## Top-level fields
- workoutName: string (required)
- sportType: { sportTypeId: number, sportTypeKey: string } (required)
  - IDs: 1=running, 2=cycling, 3=swimming, 4=walking, 5=multi, 6=fitness_equipment, 7=hiking
- workoutSegments: array of segment objects (required)
- description: string (optional)

## Segment fields
- segmentOrder: number (1-based, required)
- sportType: same as top-level (required)
- workoutSteps: array of step objects (required)

## Step types

### ExecutableStepDTO (regular steps)
- type: "ExecutableStepDTO" (required)
- stepOrder: number (1-based within the containing steps array)
- stepType: { stepTypeId: number, stepTypeKey: string }
  - 1="warmup", 2="cooldown", 3="interval", 4="recovery", 5="rest"
- endCondition: { conditionTypeId: number, conditionTypeKey: string }
  - 1="distance" (endConditionValue in meters)
  - 2="time" (endConditionValue in seconds)
  - 7="lap.button" (press lap button; no endConditionValue needed)
- endConditionValue: number (required for distance/time conditions)
- targetType: { workoutTargetTypeId: number, workoutTargetTypeKey: string }
  - 1="no.target"
  - 2="speed" — use targetValueOne/targetValueTwo (m/s)
  - 4="heart.rate.zone" — use zoneNumber (1-5), NOT targetValueOne/targetValueTwo
  - 6="cadence" — use targetValueOne/targetValueTwo (steps per minute)
  - 11="power.zone" — use zoneNumber
- zoneNumber: number 1-5 (for heart.rate.zone or power.zone targets only)
- targetValueOne: number (lower bound for speed/cadence ranges)
- targetValueTwo: number (upper bound for speed/cadence ranges)
- description: string (optional, displayed on device)

### RepeatGroupDTO (repeat blocks)
- type: "RepeatGroupDTO" (required)
- stepOrder: number (1-based within the containing steps array)
- numberOfIterations: number (how many times to repeat)
- workoutSteps: array of ExecutableStepDTO (the steps to repeat)
  - stepOrder within this array is 1-based and independent of the parent

## Notes
- NEVER use targetValueOne/targetValueTwo for heart rate zones — use zoneNumber instead.
  Using targetValueOne/targetValueTwo with heart.rate.zone target type causes Garmin to
  misinterpret the values as pace (m/s), resulting in impossible paces like ~11 sec/mile.
- RepeatGroupDTO cannot be nested inside another RepeatGroupDTO.
- All stepOrder values within the same array must be sequential starting from 1.
`;

export function registerResources(server: McpServer): void {
  for (const [name, template] of Object.entries(WORKOUT_TEMPLATES)) {
    const uri = `workout://templates/${name}`;
    server.resource(name, uri, async (resourceUri) => ({
      contents: [
        {
          uri: resourceUri.href,
          mimeType: "application/json",
          text: JSON.stringify(template, null, 2),
        },
      ],
    }));
  }

  server.resource(
    "workout-structure-reference",
    "workout://reference/structure",
    async (resourceUri) => ({
      contents: [
        {
          uri: resourceUri.href,
          mimeType: "text/markdown",
          text: WORKOUT_STRUCTURE_REFERENCE,
        },
      ],
    })
  );
}
