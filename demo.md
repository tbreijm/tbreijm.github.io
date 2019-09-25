# About the Demo

The [demo](https://tbreijm.github.io) is a siumulation of the day in the life of a policy advisor. The model includes three context: 

* Work Activities
* Walking Movements
* Communication with Stakeholders.

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
