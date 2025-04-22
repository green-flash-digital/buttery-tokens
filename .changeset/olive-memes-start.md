---
"buttery-tokens": patch
"@buttery/core": patch
"@buttery/studio": patch
"@buttery/studio-tokens": patch
---

Refactors the entire repository to break out out of the original buttery tools. This PR consolidates all of the disparate functions into a singular `ButteryTokens` class that is then used to expose an API to create and develop tokens. In addition, this API is used in a CLI created with `fizmoo`.
