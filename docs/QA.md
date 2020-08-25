# QA
The [rosetta-cli](https://github.com/coinbase/rosetta-cli) validates the correctness of Rosetta API
 implementations. It requires user input, and in this context should be considered part of the 
 pre-release process until it can be automated.

### Check

```console
go get github.com/coinbase/rosetta-cli
rosetta-cli check:data
rosetta-cli check:constructon
```