# About the Demo

The [demo](https://tbreijm.github.io) is a siumulation of the day in the life of a policy advisor. The model includes three context: 

* Work Activities
* Walking Movements
* Communication with Stakeholders

In BrixMS, models are built from bricks which are turned into simulation events.

The advisor brick is defined as following:
```json
{
  "name": "advisor",
  "id": 0,
  "communications": 0,
  "distribution": [], 
  "x": 40, "y": 40
}
```

## Work Activities
The work activities of a policy advisor in this model are:

* Research: investigation of problems and issues of the stakeholders
* Meetings: meetings with colleagues and stakeholders
* Preparation Work: creating documents and consolidating information

Every advisor has a workload
```json
{ 
  "name": "workload", 
  "activities": ["research", "meeting", "preparation"], 
  "max": 5, 
  "count": 0
}
```

The advisor takes on a role as a worker
```json
{
  "name": "worker", "attributes": [
    { "name": "id" },
    { "name": "distribution", "writable": true}
  ]
}
```

The workload takes on a role as a schedule
```json
{
  "name": "schedule", "attributes": [
    { "name": "activities" },
    { "name": "max"},
    { "name": "count", "writable": true }
  ]
}
```

The worker logs work according to what is scheduled (in this demo this is randomised)
```json
{
  "name": "log",
  "roles": ["schedule", "worker"],
  "action": "
    const v = schedule.activities.map(a => Math.random()); 
    v[0] = 1; 
    v.sort((a,b) => a-b); 
    worker.distribution = schedule.activities.map((a,i) => [a, ((i == 0) ? v[i] : v[i] - v[i-1])]);
    schedule.count += 1;"
}
```

The logging happens as long as the schedule has activities (so the model terminates)
```json
{
  "name": "log until",
  "roles": ["schedule"],
  "condition": "schedule.count < schedule.max"
}
```

Together this forms the following interaction
```json
{
  "name": "work",
  "constraints": ["log until"],
  "behaviours": ["log"]
}
```

## Walking Movements

A policy advisor also travels quite a bit, walking from one part of the building to another for all the various activities.

The office is a structure brick
```json
{ "name": "office", "left": 30, "right": 70, "top": 30, "bottom": 70 }
```

The walking is simulated by a random movement generator structure
```json
{ 
  "name": "walks", 
  "attributes": {
    "dx": "(0.5-Math.random())*4", 
    "dy": "(0.5-Math.random())*4"
  }, 
  "structureName": "walk", 
  "max": 30, 
  "count": 0
}
```

Together the advisor, office and walks take on the following roles
```json
{
  "name": "movable", "attributes": [
    { "name": "x", "writable": true },
    { "name": "y", "writable": true }
  ]
},
{
  "name": "force", "attributes": [
    { "name": "dx" },
    { "name": "dy" }
  ]
},
{
  "name": "bounds", "attributes": [
    { "name": "left" },
    { "name": "right" },
    { "name": "top" },
    { "name": "bottom" }
  ]
},
{
  "name": "generator", "attributes": [
    { "name": "structureName"},
    { "name": "attributes"},
    { "name": "max"},
    { "name": "count", "writable": true }
  ]
}
```

These roles are then used in two behaviours
```json
{
  "name": "move",
  "roles": ["movable", "force"],
  "action": "
    movable.x += force.dx; 
    movable.y += force.dy; 
    force.deactivated = true;"
},
{
  "name": "generate",
  "roles": ["generator"],
  "action": "create(generator.structureName, generator.attributes); generator.count += 1"
}
```

Move and generate are regulated by two constraints
```json
{
  "name": "within bounds",
  "roles": ["movable", "force", "bounds"],
  "condition": "
    (bounds.left < (movable.x + force.dx) && 
    (movable.x + force.dx) < bounds.right) && 
    (bounds.top < (movable.y + force.dy) && 
    (movable.y + force.dy) < bounds.bottom)"
},
{
  "name": "generate until",
  "roles": ["generator"],
  "condition": "generator.count < generator.max"
}
```

The (move, within bounds) and (generate, generate until) pairs are used to build the following interaction bricks
```json
{
  "name": "generating",
  "constraints": ["generate until"],
  "behaviours": ["generate"]
},
{
  "name": "movement",
  "constraints": ["within bounds"],
  "behaviours": ["move"]
}
```

These bricks together simulate the movement of an advisor walking through the halls.

## Communication with Stakeholders
Advisors also have constant lines of communication with stakeholders.

```json
{ "name": "stakeholder-0", "id": 1, "communications": 0}
```

Communication is based on the roles of sender and receiver
```json
{
  "name": "sender", "attributes": [
    { "name": "id" }
  ]
},
{
  "name": "receiver", "attributes": [
    { "name": "id" },
    { "name": "communications", "writable": true }
  ]
}
```

The sender sends a message to the receiver as follows
```json
{
  "name": "send",
  "roles": ["sender", "receiver"],
  "action": "receiver.communications += 1"
}
```

Sending only occurs occasionally and a person doesn't send messages to themselves
```json
{
  "name": "can send",
  "roles": ["sender", "receiver", "constants", "limiter"],
  "condition": "(Math.random() < constants.p) ? 
    (receiver.communications < limiter.limit) : false"
},
{
  "name": "no self comms",
  "roles": ["sender", "receiver"],
  "condition": "sender.id != receiver.id"
}
```

The final step is the interaction brick
```json
{
  "name": "communication",
  "constraints": ["no self comms", "can send"],
  "behaviours": ["send"]
}
```

## Summary
The demo uses the advisor structure in the contexts of work activities, walking movements and communication with stakeholders
