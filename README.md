# BrixMS

![BrixMS](https://github.com/tbreijm/tbreijm.github.io/blob/master/BrixMS.png)

Building Simulation Models with Context Independent Brixs.

The original idea still holds but with time comes experience. To read the [original work](http://resolver.tudelft.nl/uuid:11c0bf24-9b58-4a3a-835e-d26b43aaaa59)

## What's new in V2

### 3 Core Entities
* Models: a collection of simple - no linkage to other models - attributes
* Relationships: a set of collections of models that are transiently linked to each other
* Actions: instructions on what needs to be done when current graph changes

### Hypergraph Data Management
* Testable and verifiable core data management
* Change Propagation
* Transient Linking (flexible associative relationships instead of rigid hierarchical inheritance structures)
* Serialisation to and from JSON

### TypeScript
* Rewritten in TypeScript
* IDE Support for Model and Relationship Types
* Mocha Test Suite and Coverage Reporting

## How it Works
1. Load a base state
2. Trigger actions
3. Change the hypergraph
4. Repeat steps 2 and 3 until an ending condition has been reached

## Installing & Running
