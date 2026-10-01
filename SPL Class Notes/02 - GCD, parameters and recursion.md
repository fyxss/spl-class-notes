---
tags: [spl, c-programming, functions, recursion]
---

# 02 — GCD, parameters and recursion

## Greatest common divisor (GCD)

The **greatest common divisor** is the largest positive integer that divides both numbers. The GCD of 12 and 20 is 4. For positive inputs, try divisors from `min(a,b)` downward. The first value that divides both numbers is the GCD:

```c
int gcd_slow(int a, int b) {
    int limit = (a < b) ? a : b;
    for (int i = limit; i >= 1; --i) {
        if (a % i == 0 && b % i == 0) return i;
    }
    return 1;
}
```

This takes O(min(a,b)) trials in the worst case.

### Euclid's algorithm

Repeatedly replace `(a,b)` by `(b,a%b)` until `b` becomes 0. For `(12,20)`: `(12,20) → (20,12) → (12,8) → (8,4) → (4,0)`, so the answer is 4.

```c
int gcd(int a, int b) {
    while (b != 0) {
        int remainder = a % b;
        a = b;
        b = remainder;
    }
    return a;
}
```

The subtraction form is `gcd(a,b) = gcd(a-b,b)` when `a>b`, and the stopping rule is `gcd(a,0)=a`. A recursive remainder version is:

```c
int gcd(int a, int b) {
    if (b == 0) return a;
    return gcd(b, a % b);
}
```

For positive inputs, the remainder version takes O(log min(a,b)) steps. The iterative version uses O(1) extra space; the recursive version also uses space for its active calls.

## Passing values and addresses

C passes **every argument by value**. If the argument is an integer, the function receives a copy of that integer. If it is a pointer, the function receives a copy of an address and can change the object at that address.

```c
void increase_value(int x) { x += 5; }
void increase_original(int *x) { *x += 5; }

int main(void) {
    int a = 6;
    increase_value(a);      // a remains 6
    increase_original(&a);  // a becomes 11
    return 0;
}
```

The second pattern is often called **pass by reference**, although C implements it by passing a pointer by value. Arrays passed to functions likewise provide access to their original elements; an array parameter does not automatically carry the array length, so pass the length separately.

```c
void process(int a[], int size);

// For an array of 100 elements:
// process(arr, 100);       // all 100 elements
// process(arr + 1, 99);    // skip the first element
```

If a pointer starts one element later, reduce the remaining length by one to avoid going beyond the array.

## Function calls and recursion

Each call has its own local state and a return address. Active calls are typically organized on a stack: **last in, first out (LIFO)**. A recursive function needs (1) a base case and (2) a call that moves toward it. Otherwise repeated calls can exhaust the call stack.

For a nonnegative `n`, print the numbers from `n` down to 1:

```c
void print_down(int n) {
    if (n == 0) return;      // base case
    printf("%d\n", n);
    print_down(n - 1);       // recursive step
}
```

### Recursive array sum

For a nonnegative size, stop at size 0, then add the last element and recurse over the rest.

```c
int sum_array(const int a[], int size) {
    if (size == 0) return 0;
    return a[size - 1] + sum_array(a, size - 1);
}
```

This takes O(n) time and O(n) call-stack space.

### Sum of even elements

Include the last element only when it is even; the recursive call still processes the remaining elements.

```c
int sum_even(const int a[], int size) {
    if (size == 0) return 0;
    int last = a[size - 1];
    int rest = sum_even(a, size - 1);
    return last % 2 == 0 ? last + rest : rest;
}
```

For `{1, 2, 3, 4}`, `sum_array` returns 10 and `sum_even` returns 6.

Next: [[03 - Library functions, strings and storage]].
