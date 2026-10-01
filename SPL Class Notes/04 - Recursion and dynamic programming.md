---
tags: [spl, c-programming, recursion, dynamic-programming]
---

# 04 — Recursion and dynamic programming

## Recursive factorial and GCD

For a nonnegative integer, `n! = n × (n−1)!`, with `0! = 1`. The function stops at 0 or 1:

```c
long long factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}
```

For GCD, the recursive step is `gcd(b, a % b)`. For example, `gcd(9,6) → gcd(6,3) → gcd(3,0) → 3`.

## Least common multiple (LCM)

For positive integers, `a × b = gcd(a,b) × lcm(a,b)`. Therefore:

```c
long long gcd_ll(long long a, long long b) {
    if (b == 0) return a;
    return gcd_ll(b, a % b);
}

long long lcm(long long a, long long b) {
    return (a / gcd_ll(a, b)) * b;
}
```

For 12 and 20, the GCD is 4 and the LCM is 60. Dividing before multiplying reduces the risk of intermediate overflow, although the final result must still fit the type.

## Fibonacci: repeated calls

The Fibonacci sequence is `0, 1, 1, 2, 3, 5, 8, ...`. With `fib(0)=0`, `fib(1)=1`, and `fib(n)=fib(n−1)+fib(n−2)`, a direct recursive function is:

```c
long long fib_recursive(int n) {
    if (n < 2) return n;
    return fib_recursive(n - 1) + fib_recursive(n - 2);
}
```

Different branches ask for the same values again. There are **25 total calls for `fib(6)`**, including the initial call. If `T(n)` counts calls, then `T(0)=T(1)=1` and `T(n)=1+T(n−1)+T(n−2)`.

| n | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|---|
| Fibonacci value | 0 | 1 | 1 | 2 | 3 | 5 | 8 | 13 | 21 |
| Total calls | 1 | 1 | 3 | 5 | 9 | 15 | 25 | 41 | 67 |

The time grows exponentially (bounded above by O(2ⁿ)); the maximum call depth uses O(n) stack space.

### Iterative Fibonacci

Keep only the previous two values:

```c
long long fib_iterative(int n) {
    if (n < 2) return n;
    long long a = 0, b = 1;
    for (int i = 2; i <= n; ++i) {
        long long next = a + b;
        a = b;
        b = next;
    }
    return b;
}
```

This takes O(n) time and O(1) extra space.

## Tower of Hanoi

Move `n` disks from a source peg to a destination peg using an auxiliary peg. Move one disk at a time, and never place a larger disk on a smaller disk.

1. Move the top `n−1` disks from source to auxiliary.
2. Move the largest remaining disk from source to destination.
3. Move the `n−1` disks from auxiliary to destination.

```c
void hanoi(int n, char source, char auxiliary, char destination) {
    if (n == 0) return;
    hanoi(n - 1, source, destination, auxiliary);
    printf("%c -> %c\n", source, destination);
    hanoi(n - 1, auxiliary, source, destination);
}
```

For nonnegative `n`, the number of moves is `2ⁿ−1`. Time is O(2ⁿ), and the active recursive calls use O(n) stack space.

## Dynamic programming (DP)

**Dynamic programming (DP)** solves overlapping subproblems and stores their results so that the same work is not repeated. Fibonacci has overlapping subproblems because, for example, both `fib(5)` and `fib(4)` need `fib(3)`.

### Memoization: top-down

Store answers by input `n`. Initialize the cache to `-1`, meaning “not calculated,” and check it before recursion:

```c
long long memo[51];

long long fib_memo(int n) {
    if (n < 2) return n;
    if (memo[n] != -1) return memo[n];
    memo[n] = fib_memo(n - 1) + fib_memo(n - 2);
    return memo[n];
}

void initialize_memo(void) {
    for (int i = 0; i <= 50; ++i) memo[i] = -1;
}
```

Call `initialize_memo()` before the first call to `fib_memo`. This cache supports inputs from 0 through 50. Each non-base answer is computed once, giving O(n) time and O(n) memory.

### Tabulation: bottom-up

The same relation can be computed from the base cases upward:

```c
long long fib[51] = {0, 1};
for (int i = 2; i <= 50; ++i)
    fib[i] = fib[i - 1] + fib[i - 2];
```

This also takes O(n) time. If only the last value is needed, two variables reduce extra space to O(1). For large `n`, the integer type will overflow, even though the algorithm is fast.

## Recognizing and forming a DP solution

DP problems often ask for a minimum/maximum, shortest/longest result, **number of ways**, or whether something is possible. Look for a recurrence with overlapping subproblems; the wording alone does not guarantee that DP is needed.

For coins `1, 3, 4`, making `6` by taking the largest coin first gives `4+1+1` (3 coins), while `3+3` uses 2. A greedy rule is therefore not always sufficient.

### Counting ways to climb stairs

Let `ways(i)` be the number of ways to reach step `i` by taking one or two steps. The last move came from `i−1` or `i−2`, so:

`ways(i) = ways(i−1) + ways(i−2)`, with `ways(0)=1` and `ways(1)=1`.

Thus `ways(2)=2` and `ways(3)=3`: the three possibilities for three steps are `1+1+1`, `1+2`, and `2+1`. `ways(0)=1` counts the single way to take no steps.

## Function return-type review

A `void` function performs an action without returning a value; `int`, `float`, or `char` functions return a value of the declared type. Example: a printing function may be `void print(void)`, while a calculation may be `int add(int a,int b)`.

Next: [[05 - Storage, preprocessor, arrays and first pointers]].
