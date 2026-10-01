---
tags: [spl, c-programming, bitwise, sieve, lab]
---

# 22 — Bit-packed sieve and light control

SPL lab: 15.09.2026.

## Sieve of Eratosthenes

The ordinary sieve marks composite numbers and collects the unmarked numbers as primes. For each unmarked `i`, mark multiples beginning at `i * i`; smaller multiples have already been covered.

If every mark uses an integer, an array for about `10^8` numbers needs roughly:

```text
10^8 × 4 bytes = 400,000,000 bytes ≈ 400 MB
```

This assumes four-byte integers and decimal MB. A composite mark only needs 0 or 1, so it can be stored in a **single bit**.

## Store 32 marks in one element

With 32-bit unsigned elements, locate number `n` using:

```text
array index = n / 32
bit index   = n % 32
```

```text
arr[0]: numbers  0 ... 31
arr[1]: numbers 32 ... 63
arr[2]: numbers 64 ... 95
```

Examples: number 35 uses `arr[1]`, bit 3; number 63 uses `arr[1]`, bit 31. The bit array length is `MX / 32 + 1` for numbers from 0 through `MX`.

## Sieve with packed marks

Use `ckbit` to check a mark and `setbit` to set it. Store primes in `prime` and their count in `cnt`. Handle 2 separately, then check only odd candidates and mark their odd multiples.

```c
#include <stdio.h>
#include <stdint.h>

#define MX 200
#define ckbit(i) (arr[(i) / 32] & (UINT32_C(1) << ((i) % 32)))
#define setbit(i) (arr[(i) / 32] |= (UINT32_C(1) << ((i) % 32)))

uint32_t arr[MX / 32 + 1]; // global arrays start zero-initialized
int prime[MX + 1], cnt;

void sieve(void) {
    cnt = 0;
    if (MX >= 2) prime[cnt++] = 2;

    for (int i = 3; i <= MX / i; i += 2) {
        if (ckbit(i) == 0) {
            for (int j = i * i; j <= MX; j += 2 * i)
                setbit(j);
        }
    }

    for (int i = 3; i <= MX; i += 2) {
        if (ckbit(i) == 0) prime[cnt++] = i;
    }
}

int main(void) {
    sieve();
    for (int i = 0; i < cnt; ++i)
        printf("%d\n", prime[i]);
    if (cnt > 0) printf("Last prime: %d\n", prime[cnt - 1]);
    return 0;
}
```

`uint32_t` makes the 32-bit packing assumption explicit on systems providing that type. The unsigned mask is safe for bit 31. `i <= MX / i` expresses the square-root limit without overflowing the loop-condition multiplication. The print loop uses `cnt`, rather than always reading 200 entries when fewer primes were found.

For `MX = 200`, there are 46 primes and the last is 199. Sieve time is O(n log log n). The packed marking array uses about n/8 bytes, reducing marking storage by about 32 times compared with four bytes per mark.

> [!note] Prime-array memory
> Packing `arr` reduces the marking array, but `prime[MX + 1]` still reserves an integer for every index. The number of primes up to n is approximately `n / ln(n)` for large n; this estimate is not a guaranteed allocation bound.

## Light-control exercise

Represent each light by one bit in unsigned `state`: 1 means on, 0 means off. The all-lights mask `(1 << 25) - 1` corresponds to 25 lights at indices 0 through 24. Use a 32-bit value for this example.

```c
uint32_t state = 0;
```

| Task | Operation |
|---|---|
| Turn light `i` on | `state \|= UINT32_C(1) << i;` |
| Turn light `i` off | `state &= ~(UINT32_C(1) << i);` |
| Toggle light `i` | `state ^= UINT32_C(1) << i;` |
| Show light `i` | `(state & (UINT32_C(1) << i)) ? 1 : 0` |

Show every light:

```c
for (int i = 0; i < 25; ++i)
    printf("%d ", (state & (UINT32_C(1) << i)) ? 1 : 0);
```

For an inclusive range `i` through `j`, with `0 <= i <= j < 25`, create a mask of `j - i + 1` ones and shift it into place:

```c
uint32_t mask = ((UINT32_C(1) << (j - i + 1)) - 1) << i;

state |= mask;   // turn the range on
state &= ~mask;  // turn the range off
state ^= mask;   // toggle the range
```

Parentheses are necessary: subtract 1 from the shifted 1 to make the sequence of ones, then shift the mask by `i`.

Toggle every light:

```c
state ^= (UINT32_C(1) << 25) - 1;
```

Count lights that are on by checking the same 25 positions:

```c
int count_on = 0;
for (int i = 0; i < 25; ++i)
    count_on += (state & (UINT32_C(1) << i)) != 0;
```

Next: [[23 - Variable length arguments]].
