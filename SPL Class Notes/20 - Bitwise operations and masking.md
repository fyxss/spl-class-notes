---
tags: [spl, c-programming, bitwise]
---

# 20 — Bitwise operations and masking

## AND, OR, XOR, and NOT

Bitwise operators apply to integer bits individually:

| A | B | `A & B` | `A \| B` | `A ^ B` |
|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 1 | 1 |
| 1 | 0 | 0 | 1 | 1 |
| 1 | 1 | 1 | 1 | 0 |

`~` flips every bit: 0 becomes 1 and 1 becomes 0. These differ from logical `&&`, `||`, and `!`.

For `106 = 01101010` and `173 = 10101101`:

```text
        01101010
        10101101
AND:    00101000   = 40
OR:     11101111   = 239
XOR:    11000111   = 199
```

## Masking the last three bits

A **mask** selects the bit positions of interest. For `a = 10101101`, use `00000111` to keep the lowest three bits:

```text
       10101101
AND    00000111
       --------
       00000101
```

```c
unsigned a = 173u;
unsigned lowest_three = a & 7u; // 5
```

OR with the same mask sets those three bits:

```text
       10101101
OR     00000111
       --------
       10101111
```

For an eight-bit illustration, `0xF8` is `11111000`, which keeps the upper five bits and clears the lowest three when used with AND. It does not keep the lowest three bits.

## Shift to a particular bit

Count bit positions from 0 at the rightmost bit. `1u << i` puts a 1 at position `i`:

```text
i = 0: 00000001
i = 3: 00001000
i = 5: 00100000
```

XOR with this mask toggles just that bit:

```c
a = a ^ (1u << i);
```

`0 ^ 1 = 1`; `1 ^ 1 = 0`. Bits XORed with 0 stay unchanged.

## Set, clear, toggle, and check

| Operation on bit `i` | Expression |
|---|---|
| Set to 1 | `a \| (1u << i)` |
| Clear to 0 | `a & ~(1u << i)` |
| Toggle | `a ^ (1u << i)` |
| Check | `(a & (1u << i)) != 0` |

The expression computes a result. Assign it back to change `a`:

```c
a |= 1u << i;
a &= ~(1u << i);
a ^= 1u << i;
```

Use unsigned values for these masks, and keep the shift count within the type's bit width.

## Setting a bit: examples

Setting a bit means changing 0 to 1 while leaving an existing 1 unchanged. Clearing does the reverse; toggling always changes the selected bit.

For `N = 5`, the rightmost bit is bit 1 when counting from 1, or position 0 when counting from 0:

```text
N = 5:                101
set rightmost bit:    101  = 5
clear rightmost bit:  100  = 4
toggle rightmost bit: 100  = 4
```

If a problem numbers bits from 1, shift by `k - 1`. With zero-based positions, shift by `k`.

For `N = 01100111` and zero-based `k = 5`:

```c
N = N | (1u << k);  // sets bit 5; already 1 here, so N stays 103
```

Next: [[21 - Bit fields, enumeration and macros]].
