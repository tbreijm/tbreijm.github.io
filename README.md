# BrixMS

![BrixMS](/BrixMS.png)

Modelling and simulation with context independent brix. See the [demo](https://tbreijm.github.io/) or download [demo.html](https://github.com/tbreijm/tbreijm.github.io/blob/master/demo.html) and open in any ECMAScript 6 compliant browser

BrixMS is based on the idea that Models can be built with blocks:

* Structures: absolute collection of properties
* Roles: context specific subset of properties and access rights (read-only or write) of a structure
* Behaviours: an action on one or more roles
* Constraint: condition under which a behaviour occurs
* Interactions: a collection of behaviours and constraints
* Event: a realisation of interactions

The simulation starts with the interactions, gathers all necessary roles and dynamically binds structures to these roles. Collision detection is used to determine which sets of structures satisfy the constraints. Each of these sets is used to generate events. The simulation ends when all events have been processed.
