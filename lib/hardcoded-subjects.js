// BrainForge — Complete Subject & Module Data
// All 5 subjects with their modules, topics, and content

export const subjects = [
  {
    id: "dsa-cpp",
    title: "Data Structures & Algorithms",
    subtitle: "C++ Implementation",
    icon: "🧠",
    color: "#6C63FF",
    colorLight: "rgba(108, 99, 255, 0.15)",
    gradient: "linear-gradient(135deg, #6C63FF, #8b7cf8)",
    hasCoding: true,
    modules: [
      {
        id: "1",
        title: "Introduction to Algorithms",
        topics: [
          {
            id: "1-1",
            title: "Algorithm Basics",
            duration: 45,
            content: `# Algorithm Basics

## What is an Algorithm?
An algorithm is a **step-by-step procedure** for solving a problem or accomplishing a task. Think of it as a recipe — a clear set of instructions that takes some input and produces a desired output.

### Characteristics of a Good Algorithm
1. **Finiteness** — Must terminate after a finite number of steps
2. **Definiteness** — Each step must be precisely defined
3. **Input** — Takes zero or more inputs
4. **Output** — Produces at least one output
5. **Effectiveness** — Each step must be basic enough to be carried out

### Why Study Algorithms?
- Write **efficient** code that scales
- Ace **technical interviews** at top companies
- Solve complex problems **systematically**
- Understand the **trade-offs** in software design

## Your First Algorithm: Finding the Maximum

\`\`\`cpp
#include <iostream>
using namespace std;

int findMax(int arr[], int n) {
    int maxVal = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > maxVal) {
            maxVal = arr[i];
        }
    }
    return maxVal;
}

int main() {
    int arr[] = {3, 7, 2, 9, 1, 5};
    int n = sizeof(arr) / sizeof(arr[0]);
    cout << "Maximum: " << findMax(arr, n) << endl;
    return 0;
}
\`\`\`

### Key Takeaway
Every algorithm follows the **IPO model**: Input → Process → Output. The quality of an algorithm is measured by its efficiency in terms of time and space.`,
            hasCodingProblem: true,
            codingProblem: {
              title: "Find the Second Largest Element",
              description: "Given a vector of integers, find the second largest element. If no second largest exists, return -1.",
              starterCode: `#include <vector>
using namespace std;

int findSecondLargest(vector<int>& arr) {
  // Your code here
  
}`,
              testCases: [
                { input: "[3, 7, 2, 9, 1, 5]", expected: "7", args: [[3, 7, 2, 9, 1, 5]] },
                { input: "[10, 10, 10]", expected: "-1", args: [[10, 10, 10]] },
                { input: "[1, 2]", expected: "1", args: [[1, 2]] },
                { input: "[5]", expected: "-1", args: [[5]] },
              ],
              solution: `#include <vector>
#include <climits>
using namespace std;

int findSecondLargest(vector<int>& arr) {
  int first = INT_MIN, second = INT_MIN;
  for (int num : arr) {
    if (num > first) {
      second = first;
      first = num;
    } else if (num > second && num != first) {
      second = num;
    }
  }
  return second == INT_MIN ? -1 : second;
}`,
            },
          },
          {
            id: "1-2",
            title: "Algorithm Efficiency",
            duration: 45,
            content: `# Algorithm Efficiency

## Why Does Efficiency Matter?
Two algorithms can solve the same problem but with vastly different performance. An inefficient algorithm might take **hours** while an efficient one finishes in **milliseconds**.

### Time Complexity
Measures how the running time grows as input size increases.

### Space Complexity
Measures how much extra memory an algorithm needs.

## Example: Sum of N Numbers

### Approach 1: Loop (O(n))
\`\`\`cpp
int sum(int n) {
    int total = 0;
    for (int i = 1; i <= n; i++) {
        total += i;
    }
    return total;
}
\`\`\`

### Approach 2: Formula (O(1))
\`\`\`cpp
int sum(int n) {
    return n * (n + 1) / 2;
}
\`\`\`

Both give the same result, but Approach 2 is **dramatically faster** for large n!

| n | Loop iterations | Formula steps |
|---|----------------|---------------|
| 10 | 10 | 1 |
| 1,000,000 | 1,000,000 | 1 |
| 1,000,000,000 | 1,000,000,000 | 1 |

### Key Insight
Always ask: *"Can I do better?"* — This mindset is what separates good programmers from great ones.`,
            hasCodingProblem: true,
            codingProblem: {
              title: "Efficient Pair Sum",
              description: "Given a sorted vector and a target sum, find if there exists a pair of elements that add up to the target. Do it in O(n) time.",
              starterCode: `#include <vector>
using namespace std;

bool hasPairSum(vector<int>& arr, int target) {
  // Your code here
  
}`,
              testCases: [
                { input: "[1,2,3,4,5], 9", expected: "true", args: [[1,2,3,4,5], 9] },
                { input: "[1,2,3,4,5], 10", expected: "false", args: [[1,2,3,4,5], 10] },
                { input: "[1,3,5,7], 8", expected: "true", args: [[1,3,5,7], 8] },
              ],
              solution: `#include <vector>
using namespace std;

bool hasPairSum(vector<int>& arr, int target) {
  int left = 0, right = arr.size() - 1;
  while (left < right) {
    int sum = arr[left] + arr[right];
    if (sum == target) return true;
    if (sum < target) left++;
    else right--;
  }
  return false;
}`,
            },
          },
          {
            id: "1-3",
            title: "Asymptotic Notations",
            duration: 45,
            content: `# Asymptotic Notations

## The Language of Complexity
Asymptotic notations give us a mathematical way to describe algorithm efficiency.

### Big O Notation — O(f(n))
**Upper bound** — worst case scenario.
"This algorithm will NEVER be slower than f(n)"

### Big Omega — Ω(f(n))  
**Lower bound** — best case scenario.
"This algorithm will NEVER be faster than f(n)"

### Big Theta — Θ(f(n))
**Tight bound** — average case.
"This algorithm grows at EXACTLY f(n)"

## Common Complexities (Fastest → Slowest)

| Notation | Name | Example |
|----------|------|---------|
| O(1) | Constant | Array access by index |
| O(log n) | Logarithmic | Binary search |
| O(n) | Linear | Linear search |
| O(n log n) | Linearithmic | Merge sort |
| O(n²) | Quadratic | Bubble sort |
| O(2ⁿ) | Exponential | Recursive fibonacci |

\`\`\`cpp
// O(1) - Constant
int getFirst(int arr[]) { return arr[0]; }

// O(log n) - Logarithmic  
int binarySearch(int arr[], int n, int target) {
    int lo = 0, hi = n - 1;
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}

// O(n²) - Quadratic
void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++)
        for (int j = 0; j < n-i-1; j++)
            if (arr[j] > arr[j+1])
                swap(arr[j], arr[j+1]);
}
\`\`\``,
            hasCodingProblem: false,
          },
          {
            id: "1-4",
            title: "Calculating Complexity",
            duration: 45,
            content: `# Calculating Time Complexity

## Rules for Big O

### Rule 1: Drop Constants
O(2n) → O(n), O(100) → O(1)

### Rule 2: Drop Non-Dominant Terms  
O(n² + n) → O(n²), O(n + log n) → O(n)

### Rule 3: Different Inputs = Different Variables
\`\`\`cpp
// O(a * b), NOT O(n²)
void printPairs(int a[], int sizeA, int b[], int sizeB) {
    for (int i = 0; i < sizeA; i++)
        for (int j = 0; j < sizeB; j++)
            cout << a[i] << "," << b[j] << endl;
}
\`\`\`

### Practice: What's the Complexity?
\`\`\`cpp
// Example 1
for (int i = 0; i < n; i++)        // O(n)
    for (int j = 0; j < n; j++)    // O(n)
        cout << i + j;             // Total: O(n²)

// Example 2  
for (int i = 1; i < n; i *= 2)    // O(log n)
    cout << i;

// Example 3
for (int i = 0; i < n; i++)       // O(n)
    cout << i;
for (int j = 0; j < n; j++)       // O(n)
    cout << j;                     // Total: O(n + n) = O(n)
\`\`\``,
            hasCodingProblem: false,
          },
          {
            id: "1-5",
            title: "Types of Complexity Functions",
            duration: 45,
            content: `# Types of Complexity Functions

## Visual Guide

Think of complexity as **how much longer** things take when input doubles:

| Complexity | n=10 | n=100 | n=1000 | Feels Like |
|-----------|------|-------|--------|------------|
| O(1) | 1 | 1 | 1 | Instant ⚡ |
| O(log n) | 3 | 7 | 10 | Fast 🚀 |
| O(n) | 10 | 100 | 1000 | Okay 👍 |
| O(n log n) | 30 | 700 | 10000 | Manageable 😊 |
| O(n²) | 100 | 10000 | 1000000 | Slow 🐌 |
| O(2ⁿ) | 1024 | 1.26×10³⁰ | ∞ | Impossible 💀 |

## Time vs Space Trade-off

Sometimes you can use **more memory** to get **faster execution**.

\`\`\`cpp
// Space O(1), Time O(n²) - check for duplicates
bool hasDuplicate_slow(int arr[], int n) {
    for (int i = 0; i < n; i++)
        for (int j = i+1; j < n; j++)
            if (arr[i] == arr[j]) return true;
    return false;
}

// Space O(n), Time O(n) - using a hash set
#include <unordered_set>
bool hasDuplicate_fast(int arr[], int n) {
    unordered_set<int> seen;
    for (int i = 0; i < n; i++) {
        if (seen.count(arr[i])) return true;
        seen.insert(arr[i]);
    }
    return false;
}
\`\`\`

### Golden Rule
> In most cases, **time is more expensive than space**. Prefer faster algorithms even if they use more memory.`,
            hasCodingProblem: true,
            codingProblem: {
              title: "Two Sum (Hash Map Approach)",
              description: "Given a vector of integers and a target, return the indices of two numbers that add up to the target. Use O(n) time complexity.",
              starterCode: `#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
  // Your code here
  
}`,
              testCases: [
                { input: "[2,7,11,15], 9", expected: "[0,1]", args: [[2,7,11,15], 9] },
                { input: "[3,2,4], 6", expected: "[1,2]", args: [[3,2,4], 6] },
                { input: "[3,3], 6", expected: "[0,1]", args: [[3,3], 6] },
              ],
              solution: `#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
  unordered_map<int, int> m;
  for (int i = 0; i < nums.size(); i++) {
    int complement = target - nums[i];
    if (m.count(complement)) {
      return {m[complement], i};
    }
    m[nums[i]] = i;
  }
  return {};
}`,
            },
          },
          {
            id: "1-6",
            title: "Time vs Space Complexity",
            duration: 45,
            content: `# Time vs Space Complexity Trade-offs

## Making Informed Design Choices

Every algorithm design decision involves balancing time and space. Let's explore real-world examples.

### Caching: Trade Space for Time
\`\`\`cpp
#include <unordered_map>
unordered_map<int, long long> cache;

long long fibonacci(int n) {
    if (n <= 1) return n;
    if (cache.count(n)) return cache[n];  // O(1) lookup
    cache[n] = fibonacci(n-1) + fibonacci(n-2);
    return cache[n];
}
// Without cache: O(2^n) time, O(n) space
// With cache: O(n) time, O(n) space
\`\`\`

### In-Place vs Extra Space
\`\`\`cpp
// In-place reverse: O(1) space
void reverse(int arr[], int n) {
    for (int i = 0; i < n/2; i++)
        swap(arr[i], arr[n-1-i]);
}

// Extra array reverse: O(n) space
int* reverseNew(int arr[], int n) {
    int* result = new int[n];
    for (int i = 0; i < n; i++)
        result[i] = arr[n-1-i];
    return result;
}
\`\`\`

### Decision Framework
| Situation | Prefer |
|-----------|--------|
| Real-time systems | Time over Space |
| Embedded/IoT devices | Space over Time |
| Web applications | Time over Space |
| Mobile apps | Balance both |`,
            hasCodingProblem: false,
          },
        ],
      },
      {
        id: "2",
        title: "Searching & Sorting",
        topics: [
          { id: "2-1", title: "Linear Search", duration: 30, content: "# Linear Search\n\nThe simplest search algorithm. Check every element one by one.\n\n```cpp\nint linearSearch(int arr[], int n, int target) {\n    for (int i = 0; i < n; i++)\n        if (arr[i] == target) return i;\n    return -1;\n}\n```\n\n**Time:** O(n) | **Space:** O(1) | **Best for:** Small or unsorted arrays", hasCodingProblem: true, codingProblem: { title: "Count Occurrences", description: "Count how many times a target appears in a vector.", starterCode: "#include <vector>\nusing namespace std;\n\nint countOccurrences(vector<int>& arr, int target) {\n  // Your code here\n}", testCases: [{ input: "[1,2,3,2,2,4], 2", expected: "3", args: [[1,2,3,2,2,4], 2] }, { input: "[1,1,1], 1", expected: "3", args: [[1,1,1], 1] }, { input: "[1,2,3], 5", expected: "0", args: [[1,2,3], 5] }], solution: "#include <vector>\nusing namespace std;\n\nint countOccurrences(vector<int>& arr, int target) {\n  int count = 0;\n  for (int x : arr) if (x == target) count++;\n  return count;\n}" } },
          { id: "2-2", title: "Binary Search", duration: 45, content: "# Binary Search\n\nDivide and conquer on sorted arrays. Eliminates half the search space each step.\n\n```cpp\nint binarySearch(int arr[], int n, int target) {\n    int lo = 0, hi = n - 1;\n    while (lo <= hi) {\n        int mid = lo + (hi - lo) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    return -1;\n}\n```\n\n**Time:** O(log n) | **Space:** O(1) | **Prerequisite:** Array must be sorted!", hasCodingProblem: true, codingProblem: { title: "First and Last Position", description: "Find the first and last position of a target in a sorted vector. Return a vector {-1, -1} if not found.", starterCode: "#include <vector>\nusing namespace std;\n\nvector<int> searchRange(vector<int>& nums, int target) {\n  // Your code here\n}", testCases: [{ input: "[5,7,7,8,8,10], 8", expected: "[3,4]", args: [[5,7,7,8,8,10], 8] }, { input: "[5,7,7,8,8,10], 6", expected: "[-1,-1]", args: [[5,7,7,8,8,10], 6] }], solution: "#include <vector>\nusing namespace std;\n\nint findBound(vector<int>& nums, int target, bool isFirst) {\n  int lo = 0, hi = nums.size() - 1, result = -1;\n  while (lo <= hi) {\n    int mid = lo + (hi - lo) / 2;\n    if (nums[mid] == target) {\n      result = mid;\n      if (isFirst) hi = mid - 1;\n      else lo = mid + 1;\n    }\n    else if (nums[mid] < target) lo = mid + 1;\n    else hi = mid - 1;\n  }\n  return result;\n}\n\nvector<int> searchRange(vector<int>& nums, int target) {\n  return {findBound(nums, target, true), findBound(nums, target, false)};\n}" } },
          { id: "2-3", title: "Bubble Sort", duration: 30, content: "# Bubble Sort\n\nRepeatedly swap adjacent elements if they're in the wrong order.\n\n```cpp\nvoid bubbleSort(int arr[], int n) {\n    for (int i = 0; i < n-1; i++) {\n        bool swapped = false;\n        for (int j = 0; j < n-i-1; j++) {\n            if (arr[j] > arr[j+1]) {\n                swap(arr[j], arr[j+1]);\n                swapped = true;\n            }\n        }\n        if (!swapped) break; // Optimization\n    }\n}\n```\n\n**Time:** O(n²) worst, O(n) best | **Space:** O(1) | **Stable:** Yes", hasCodingProblem: false },
          { id: "2-4", title: "Selection Sort", duration: 30, content: "# Selection Sort\n\nFind the minimum element and place it at the beginning.\n\n```cpp\nvoid selectionSort(int arr[], int n) {\n    for (int i = 0; i < n-1; i++) {\n        int minIdx = i;\n        for (int j = i+1; j < n; j++)\n            if (arr[j] < arr[minIdx]) minIdx = j;\n        swap(arr[i], arr[minIdx]);\n    }\n}\n```\n\n**Time:** O(n²) always | **Space:** O(1) | **Stable:** No", hasCodingProblem: false },
          { id: "2-5", title: "Insertion Sort", duration: 30, content: "# Insertion Sort\n\nBuild sorted array one element at a time, inserting each into its correct position.\n\n```cpp\nvoid insertionSort(int arr[], int n) {\n    for (int i = 1; i < n; i++) {\n        int key = arr[i];\n        int j = i - 1;\n        while (j >= 0 && arr[j] > key) {\n            arr[j+1] = arr[j];\n            j--;\n        }\n        arr[j+1] = key;\n    }\n}\n```\n\n**Time:** O(n²) worst, O(n) best | **Space:** O(1) | **Best for:** Nearly sorted data", hasCodingProblem: false },
          { id: "2-6", title: "Merge Sort", duration: 45, content: "# Merge Sort\n\nDivide array in half, sort each half, then merge them back.\n\n```cpp\nvoid merge(int arr[], int l, int m, int r) {\n    int n1 = m - l + 1, n2 = r - m;\n    int L[n1], R[n2];\n    for (int i = 0; i < n1; i++) L[i] = arr[l+i];\n    for (int j = 0; j < n2; j++) R[j] = arr[m+1+j];\n    int i = 0, j = 0, k = l;\n    while (i < n1 && j < n2)\n        arr[k++] = (L[i] <= R[j]) ? L[i++] : R[j++];\n    while (i < n1) arr[k++] = L[i++];\n    while (j < n2) arr[k++] = R[j++];\n}\n\nvoid mergeSort(int arr[], int l, int r) {\n    if (l < r) {\n        int m = l + (r - l) / 2;\n        mergeSort(arr, l, m);\n        mergeSort(arr, m+1, r);\n        merge(arr, l, m, r);\n    }\n}\n```\n\n**Time:** O(n log n) always | **Space:** O(n) | **Stable:** Yes", hasCodingProblem: true, codingProblem: { title: "Merge Two Sorted Arrays", description: "Merge two sorted vectors into one sorted vector.", starterCode: "#include <vector>\nusing namespace std;\n\nvector<int> mergeSorted(vector<int>& arr1, vector<int>& arr2) {\n  // Your code here\n}", testCases: [{ input: "[1,3,5], [2,4,6]", expected: "[1,2,3,4,5,6]", args: [[1,3,5],[2,4,6]] }, { input: "[1], [2,3,4]", expected: "[1,2,3,4]", args: [[1],[2,3,4]] }], solution: "#include <vector>\nusing namespace std;\n\nvector<int> mergeSorted(vector<int>& arr1, vector<int>& arr2) {\n  vector<int> result;\n  int i = 0, j = 0;\n  while (i < arr1.size() && j < arr2.size()) {\n    if (arr1[i] <= arr2[j]) {\n      result.push_back(arr1[i++]);\n    } else {\n      result.push_back(arr2[j++]);\n    }\n  }\n  while (i < arr1.size()) result.push_back(arr1[i++]);\n  while (j < arr2.size()) result.push_back(arr2[j++]);\n  return result;\n}" } },
          { id: "2-7", title: "Quick Sort", duration: 45, content: "# Quick Sort\n\nPick a pivot, partition around it, recursively sort partitions.\n\n```cpp\nint partition(int arr[], int lo, int hi) {\n    int pivot = arr[hi], i = lo - 1;\n    for (int j = lo; j < hi; j++) {\n        if (arr[j] < pivot) {\n            i++;\n            swap(arr[i], arr[j]);\n        }\n    }\n    swap(arr[i+1], arr[hi]);\n    return i + 1;\n}\n\nvoid quickSort(int arr[], int lo, int hi) {\n    if (lo < hi) {\n        int pi = partition(arr, lo, hi);\n        quickSort(arr, lo, pi - 1);\n        quickSort(arr, pi + 1, hi);\n    }\n}\n```\n\n**Time:** O(n log n) avg, O(n²) worst | **Space:** O(log n) | **Fastest in practice**", hasCodingProblem: false },
          { id: "2-8", title: "Sorting Comparison", duration: 45, content: "# Comparing Sorting Algorithms\n\n| Algorithm | Best | Average | Worst | Space | Stable |\n|-----------|------|---------|-------|-------|--------|\n| Bubble | O(n) | O(n²) | O(n²) | O(1) | ✅ |\n| Selection | O(n²) | O(n²) | O(n²) | O(1) | ❌ |\n| Insertion | O(n) | O(n²) | O(n²) | O(1) | ✅ |\n| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) | ✅ |\n| Quick | O(n log n) | O(n log n) | O(n²) | O(log n) | ❌ |\n\n### When to Use What?\n- **Small arrays (n < 50):** Insertion Sort\n- **General purpose:** Quick Sort\n- **Guaranteed O(n log n):** Merge Sort\n- **Nearly sorted:** Insertion Sort\n- **Stability needed:** Merge Sort", hasCodingProblem: false },
        ],
      },
      {
        id: "3",
        title: "Data Structures Fundamentals",
        topics: [
          { id: "3-1", title: "Introduction to Data Structures", duration: 45, content: "# Introduction to Data Structures\n\nData structures are ways to organize and store data for efficient access and modification.\n\n## Types\n- **Linear:** Arrays, Linked Lists, Stacks, Queues\n- **Non-Linear:** Trees, Graphs\n- **Hash-based:** Hash Tables, Sets\n\n## Choosing the Right Data Structure\n| Need | Best DS |\n|------|--------|\n| Random access | Array |\n| Frequent insert/delete | Linked List |\n| LIFO | Stack |\n| FIFO | Queue |\n| Key-value lookup | Hash Map |\n| Hierarchical data | Tree |", hasCodingProblem: false },
          { id: "3-2", title: "Arrays & Operations", duration: 30, content: "# Arrays\n\nContiguous memory blocks for storing elements of the same type.\n\n```cpp\nint arr[5] = {1, 2, 3, 4, 5};\narr[2] = 10; // O(1) access\n```\n\n**Operations:** Insert O(n), Delete O(n), Access O(1), Search O(n)", hasCodingProblem: true, codingProblem: { title: "Rotate Array", description: "Rotate a vector to the right by k positions in-place.", starterCode: "#include <vector>\nusing namespace std;\n\nvector<int>& rotateArray(vector<int>& arr, int k) {\n  // Your code here\n  // Modify arr in-place and return it\n}", testCases: [{ input: "[1,2,3,4,5], 2", expected: "[4,5,1,2,3]", args: [[1,2,3,4,5], 2] }, { input: "[1,2,3], 1", expected: "[3,1,2]", args: [[1,2,3], 1] }], solution: "#include <vector>\nusing namespace std;\n\nvector<int>& rotateArray(vector<int>& arr, int k) {\n  int n = arr.size();\n  k = k % n;\n  vector<int> temp(n);\n  for (int i = 0; i < n; i++) {\n    temp[(i + k) % n] = arr[i];\n  }\n  for (int i = 0; i < n; i++) {\n    arr[i] = temp[i];\n  }\n  return arr;\n}" } },
          { id: "3-3", title: "Linked Lists — Types", duration: 45, content: "# Linked Lists\n\nDynamic data structure where each element (node) points to the next.\n\n```cpp\nstruct Node {\n    int data;\n    Node* next;\n    Node(int val) : data(val), next(nullptr) {}\n};\n```\n\n**Types:** Singly, Doubly, Circular\n\n**Pros:** Dynamic size, efficient insert/delete\n**Cons:** No random access, extra memory for pointers", hasCodingProblem: false },
          { id: "3-4", title: "Linked List Operations", duration: 45, content: "# Linked List Operations\n\n```cpp\n// Insert at head - O(1)\nvoid insertHead(Node*& head, int val) {\n    Node* newNode = new Node(val);\n    newNode->next = head;\n    head = newNode;\n}\n\n// Delete node - O(n)\nvoid deleteNode(Node*& head, int val) {\n    if (head && head->data == val) {\n        Node* temp = head;\n        head = head->next;\n        delete temp;\n        return;\n    }\n    Node* curr = head;\n    while (curr->next && curr->next->data != val)\n        curr = curr->next;\n    if (curr->next) {\n        Node* temp = curr->next;\n        curr->next = temp->next;\n        delete temp;\n    }\n}\n```", hasCodingProblem: true, codingProblem: { title: "Reverse a Linked List", description: "Given a vector representing a linked list, reverse it.", starterCode: "#include <vector>\nusing namespace std;\n\nvector<int> reverseList(vector<int>& arr) {\n  // Your code here\n}", testCases: [{ input: "[1,2,3,4,5]", expected: "[5,4,3,2,1]", args: [[1,2,3,4,5]] }, { input: "[1]", expected: "[1]", args: [[1]] }], solution: "#include <vector>\nusing namespace std;\n\nvector<int> reverseList(vector<int>& arr) {\n  vector<int> result;\n  for (int i = arr.size() - 1; i >= 0; i--) {\n    result.push_back(arr[i]);\n  }\n  return result;\n}" } },
          { id: "3-5", title: "Stacks", duration: 45, content: "# Stacks — LIFO\n\nLast In, First Out. Think of a stack of plates.\n\n```cpp\n#include <stack>\nstack<int> s;\ns.push(10);  // Add to top\ns.push(20);\ns.top();     // Peek: 20\ns.pop();     // Remove top\ns.size();    // 1\ns.empty();   // false\n```\n\n**Applications:** Function calls, undo/redo, expression evaluation, browser back button", hasCodingProblem: true, codingProblem: { title: "Valid Parentheses", description: "Check if a string of brackets ()[]\\{\\} is valid.", starterCode: "#include <string>\n#include <stack>\nusing namespace std;\n\nbool isValid(string s) {\n  // Your code here\n}", testCases: [{ input: "\"()[]{}\"", expected: "true", args: ["()[]{}"] }, { input: "\"(]\"", expected: "false", args: ["(]"] }, { input: "\"([)]\"", expected: "false", args: ["([)]"] }, { input: "\"{[]}\"", expected: "true", args: ["{[]}"] }], solution: "#include <string>\n#include <stack>\n#include <unordered_map>\nusing namespace std;\n\nbool isValid(string s) {\n  stack<char> st;\n  unordered_map<char, char> m;\n  m[')'] = '(';\n  m[']'] = '[';\n  m['}'] = '{';\n  for (char c : s) {\n    if (c == '(' || c == '[' || c == '{') {\n      st.push(c);\n    } else {\n      if (st.empty() || st.top() != m[c]) {\n        return false;\n      }\n      st.pop();\n    }\n  }\n  return st.empty();\n}" } },
          { id: "3-6", title: "Queues", duration: 45, content: "# Queues — FIFO\n\nFirst In, First Out. Think of a line at a ticket counter.\n\n```cpp\n#include <queue>\nqueue<int> q;\nq.push(10);  // Enqueue\nq.push(20);\nq.front();   // 10\nq.back();    // 20\nq.pop();     // Dequeue front\n```\n\n**Types:** Simple Queue, Circular Queue, Priority Queue, Deque\n\n**Applications:** BFS, task scheduling, print queue, message queues", hasCodingProblem: false },
        ],
      },
    ],
  },
  {
    id: "react-js",
    title: "React JS",
    subtitle: "Modern Frontend Development",
    icon: "⚛️",
    color: "#61DAFB",
    colorLight: "rgba(97, 218, 251, 0.15)",
    gradient: "linear-gradient(135deg, #61DAFB, #21a0c8)",
    hasCoding: true,
    modules: [
      {
        id: "1",
        title: "React Fundamentals",
        topics: [
          { id: "1-1", title: "Introduction to React", duration: 45, content: "# Introduction to React\n\n## What is React?\nReact is a **JavaScript library** for building user interfaces, created by Facebook (Meta) in 2013.\n\n### Why React?\n- **Component-based** — Build encapsulated components\n- **Declarative** — Describe what the UI should look like\n- **Virtual DOM** — Efficient updates\n- **Huge ecosystem** — React Router, Redux, Next.js\n\n### Setting Up\n```bash\nnpx create-react-app my-app\ncd my-app\nnpm start\n```\n\n### Your First Component\n```jsx\nfunction Welcome() {\n  return <h1>Hello, React! 🚀</h1>;\n}\n\nexport default Welcome;\n```", hasCodingProblem: true, codingProblem: { title: "Create a Greeting Component", description: "Write a function that returns a greeting message with the given name.", starterCode: "function greet(name) {\n  // Return a greeting string\n}", testCases: [{ input: "\"Saiyash\"", expected: "\"Hello, Saiyash!\"", args: ["Saiyash"] }, { input: "\"React\"", expected: "\"Hello, React!\"", args: ["React"] }], solution: "function greet(name) {\n  return `Hello, ${name}!`;\n}" } },
          { id: "1-2", title: "Modern JavaScript for React", duration: 45, content: "# ES6+ for React\n\n## Essential Features\n\n### Arrow Functions\n```javascript\nconst add = (a, b) => a + b;\nconst greet = name => `Hello ${name}`;\n```\n\n### Destructuring\n```javascript\nconst { name, age } = person;\nconst [first, ...rest] = array;\n```\n\n### Template Literals\n```javascript\nconst msg = `Hello ${name}, you are ${age} years old`;\n```\n\n### Spread/Rest\n```javascript\nconst newArr = [...oldArr, newItem];\nconst newObj = { ...oldObj, key: 'value' };\n```\n\n### Optional Chaining & Nullish Coalescing\n```javascript\nconst city = user?.address?.city ?? 'Unknown';\n```", hasCodingProblem: false },
          { id: "1-3", title: "Functional Components", duration: 45, content: "# Functional Components\n\nModern React uses functions, not classes.\n\n```jsx\nfunction UserCard({ name, email, avatar }) {\n  return (\n    <div className=\"card\">\n      <img src={avatar} alt={name} />\n      <h2>{name}</h2>\n      <p>{email}</p>\n    </div>\n  );\n}\n```\n\n### Rules\n1. Name starts with **capital letter**\n2. Must return **JSX** (or null)\n3. One component per file (recommended)", hasCodingProblem: false },
          { id: "1-4", title: "Props and PropTypes", duration: 45, content: "# Props — Passing Data\n\nProps are **read-only** arguments passed from parent to child.\n\n```jsx\n// Parent\n<UserCard name=\"Saiyash\" role=\"Developer\" />\n\n// Child\nfunction UserCard({ name, role }) {\n  return <p>{name} is a {role}</p>;\n}\n\n// Default props\nUserCard.defaultProps = {\n  role: 'Student'\n};\n```", hasCodingProblem: true, codingProblem: { title: "Object Transformer", description: "Given an array of user objects with name and age, return an array of formatted strings.", starterCode: "function formatUsers(users) {\n  // Your code here\n}", testCases: [{ input: '[{\"name\":\"Alice\",\"age\":25}]', expected: '[\"Alice (25)\"]', args: [[{name:"Alice",age:25}]] }, { input: '[{\"name\":\"Bob\",\"age\":30},{\"name\":\"Eve\",\"age\":22}]', expected: '[\"Bob (30)\",\"Eve (22)\"]', args: [[{name:"Bob",age:30},{name:"Eve",age:22}]] }], solution: "function formatUsers(users) {\n  return users.map(u => `${u.name} (${u.age})`);\n}" } },
        ],
      },
      {
        id: "2",
        title: "JSX & Rendering",
        topics: [
          { id: "2-1", title: "JSX Basics", duration: 45, content: "# JSX — JavaScript XML\n\nJSX lets you write HTML-like syntax in JavaScript.\n\n```jsx\nconst element = <h1>Hello!</h1>;\n\n// JSX is syntactic sugar for:\nconst element = React.createElement('h1', null, 'Hello!');\n```\n\n### Rules\n- Use `className` instead of `class`\n- Use `htmlFor` instead of `for`\n- Self-closing tags: `<img />`, `<input />`\n- One root element (use fragments `<>...</>`)", hasCodingProblem: false },
          { id: "2-2", title: "Conditional Rendering", duration: 45, content: "# Conditional Rendering\n\n```jsx\n// Ternary\n{isLoggedIn ? <Dashboard /> : <Login />}\n\n// Short-circuit\n{hasNotifications && <Badge count={count} />}\n\n// Early return\nfunction ProtectedPage({ user }) {\n  if (!user) return <Redirect to=\"/login\" />;\n  return <Dashboard user={user} />;\n}\n```", hasCodingProblem: false },
        ],
      },
      {
        id: "3",
        title: "React Hooks",
        topics: [
          { id: "3-1", title: "useState", duration: 45, content: "# useState Hook\n\nManage component state in functional components.\n\n```jsx\nimport { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+</button>\n      <button onClick={() => setCount(prev => prev - 1)}>-</button>\n    </div>\n  );\n}\n```\n\n### Rules of Hooks\n1. Only call at the **top level**\n2. Only call from **React functions**\n3. Use **prev state** for updates based on current state", hasCodingProblem: true, codingProblem: { title: "Toggle Logic", description: "Write a function that toggles a boolean value.", starterCode: "function toggle(value) {\n  // Return the toggled value\n}", testCases: [{ input: "true", expected: "false", args: [true] }, { input: "false", expected: "true", args: [false] }], solution: "function toggle(value) {\n  return !value;\n}" } },
          { id: "3-2", title: "useEffect", duration: 45, content: "# useEffect Hook\n\nHandle side effects: API calls, timers, subscriptions.\n\n```jsx\nimport { useEffect, useState } from 'react';\n\nfunction UserProfile({ userId }) {\n  const [user, setUser] = useState(null);\n  \n  useEffect(() => {\n    fetch(`/api/users/${userId}`)\n      .then(res => res.json())\n      .then(data => setUser(data));\n    \n    return () => {\n      // Cleanup function\n    };\n  }, [userId]); // Dependency array\n}\n```\n\n### Dependency Array\n- `[]` — Run once on mount\n- `[dep]` — Run when dep changes\n- No array — Run every render (avoid!)", hasCodingProblem: false },
          { id: "3-3", title: "useContext", duration: 45, content: "# useContext Hook\n\nShare data across the component tree without prop drilling.\n\n```jsx\nconst ThemeContext = createContext('light');\n\nfunction App() {\n  return (\n    <ThemeContext.Provider value=\"dark\">\n      <Toolbar />\n    </ThemeContext.Provider>\n  );\n}\n\nfunction ThemedButton() {\n  const theme = useContext(ThemeContext);\n  return <button className={theme}>Click me</button>;\n}\n```", hasCodingProblem: false },
          { id: "3-4", title: "useReducer", duration: 45, content: "# useReducer Hook\n\nFor complex state logic — like a mini Redux.\n\n```jsx\nfunction reducer(state, action) {\n  switch (action.type) {\n    case 'increment': return { count: state.count + 1 };\n    case 'decrement': return { count: state.count - 1 };\n    case 'reset': return { count: 0 };\n    default: throw new Error();\n  }\n}\n\nfunction Counter() {\n  const [state, dispatch] = useReducer(reducer, { count: 0 });\n  return (\n    <>\n      <p>{state.count}</p>\n      <button onClick={() => dispatch({ type: 'increment' })}>+</button>\n    </>\n  );\n}\n```", hasCodingProblem: false },
          { id: "3-5", title: "Custom Hooks", duration: 45, content: "# Custom Hooks\n\nExtract reusable logic into custom hooks.\n\n```jsx\nfunction useLocalStorage(key, initialValue) {\n  const [value, setValue] = useState(() => {\n    const stored = localStorage.getItem(key);\n    return stored ? JSON.parse(stored) : initialValue;\n  });\n  \n  useEffect(() => {\n    localStorage.setItem(key, JSON.stringify(value));\n  }, [key, value]);\n  \n  return [value, setValue];\n}\n\n// Usage\nconst [theme, setTheme] = useLocalStorage('theme', 'light');\n```", hasCodingProblem: false },
          { id: "3-6", title: "useRef and useMemo", duration: 45, content: "# useRef & useMemo\n\n### useRef — Persist values without re-render\n```jsx\nconst inputRef = useRef(null);\ninputRef.current.focus();\n```\n\n### useMemo — Memoize expensive computations\n```jsx\nconst sortedList = useMemo(\n  () => items.sort((a, b) => a.price - b.price),\n  [items]\n);\n```\n\n### useCallback — Memoize functions\n```jsx\nconst handleClick = useCallback(\n  () => setCount(c => c + 1),\n  []\n);\n```", hasCodingProblem: false },
        ],
      },
      {
        id: "4",
        title: "State Management & Routing",
        topics: [
          { id: "4-1", title: "Context API", duration: 45, content: "# Context API for Global State\n\nContext provides a way to pass data through the component tree without prop drilling.\n\n```jsx\nexport const CartContext = createContext();\n\nexport function CartProvider({ children }) {\n  const [items, setItems] = useState([]);\n  const addItem = (item) => setItems([...items, item]);\n  \n  return (\n    <CartContext.Provider value={{ items, addItem }}>\n      {children}\n    </CartContext.Provider>\n  );\n}\n```", hasCodingProblem: false },
          { id: "4-2", title: "Redux Toolkit", duration: 45, content: "# Redux Toolkit\n\nModern Redux with less boilerplate.\n\n```jsx\nimport { createSlice, configureStore } from '@reduxjs/toolkit';\n\nconst counterSlice = createSlice({\n  name: 'counter',\n  initialState: { value: 0 },\n  reducers: {\n    increment: (state) => { state.value += 1; },\n    decrement: (state) => { state.value -= 1; },\n  },\n});\n\nconst store = configureStore({ reducer: { counter: counterSlice.reducer } });\n```", hasCodingProblem: false },
          { id: "4-3", title: "React Router v6", duration: 45, content: "# React Router v6\n\n```jsx\nimport { BrowserRouter, Routes, Route, Link } from 'react-router-dom';\n\nfunction App() {\n  return (\n    <BrowserRouter>\n      <nav>\n        <Link to=\"/\">Home</Link>\n        <Link to=\"/about\">About</Link>\n      </nav>\n      <Routes>\n        <Route path=\"/\" element={<Home />} />\n        <Route path=\"/about\" element={<About />} />\n        <Route path=\"/user/:id\" element={<UserProfile />} />\n      </Routes>\n    </BrowserRouter>\n  );\n}\n```", hasCodingProblem: false },
          { id: "4-4", title: "Dynamic & Protected Routes", duration: 45, content: "# Dynamic & Protected Routes\n\n```jsx\n// Dynamic route\nfunction UserProfile() {\n  const { id } = useParams();\n  return <h1>User {id}</h1>;\n}\n\n// Protected route\nfunction ProtectedRoute({ children }) {\n  const { user } = useAuth();\n  if (!user) return <Navigate to=\"/login\" />;\n  return children;\n}\n\n<Route path=\"/dashboard\" element={\n  <ProtectedRoute><Dashboard /></ProtectedRoute>\n} />\n```", hasCodingProblem: false },
        ],
      },
      {
        id: "5",
        title: "Forms, APIs & Advanced",
        topics: [
          { id: "5-1", title: "Controlled Components & Forms", duration: 45, content: "# Forms in React\n\n```jsx\nfunction LoginForm() {\n  const [email, setEmail] = useState('');\n  const [password, setPassword] = useState('');\n  \n  const handleSubmit = (e) => {\n    e.preventDefault();\n    // Submit logic\n  };\n  \n  return (\n    <form onSubmit={handleSubmit}>\n      <input value={email} onChange={e => setEmail(e.target.value)} />\n      <input type=\"password\" value={password}\n             onChange={e => setPassword(e.target.value)} />\n      <button type=\"submit\">Login</button>\n    </form>\n  );\n}\n```", hasCodingProblem: false },
          { id: "5-2", title: "API Integration", duration: 45, content: "# Fetching Data\n\n```jsx\nfunction UserList() {\n  const [users, setUsers] = useState([]);\n  const [loading, setLoading] = useState(true);\n  \n  useEffect(() => {\n    fetch('https://api.example.com/users')\n      .then(res => res.json())\n      .then(data => {\n        setUsers(data);\n        setLoading(false);\n      })\n      .catch(err => console.error(err));\n  }, []);\n  \n  if (loading) return <Spinner />;\n  return users.map(u => <UserCard key={u.id} {...u} />);\n}\n```", hasCodingProblem: false },
          { id: "5-3", title: "Performance Optimization", duration: 45, content: "# React Performance\n\n### React.memo\n```jsx\nconst ExpensiveComponent = React.memo(function({ data }) {\n  return <div>{/* expensive render */}</div>;\n});\n```\n\n### Code Splitting\n```jsx\nconst LazyComponent = React.lazy(() => import('./HeavyComponent'));\n\n<Suspense fallback={<Loading />}>\n  <LazyComponent />\n</Suspense>\n```\n\n### Virtual Lists\nFor 1000+ items, use react-window or react-virtualized.", hasCodingProblem: false },
        ],
      },
    ],
  },
  {
    id: "apt-1",
    title: "APT - 1",
    subtitle: "Aptitude, DI/LR & Time Management",
    icon: "📊",
    color: "#FF6B6B",
    colorLight: "rgba(255, 107, 107, 0.15)",
    gradient: "linear-gradient(135deg, #FF6B6B, #ee5a24)",
    hasCoding: false,
    modules: [
      {
        id: "apt-perc",
        title: "Percentage",
        topics: [
          {
            id: "apt-perc-1",
            title: "Basic Percentage & Successive Change",
            duration: 45,
            content: "# Percentage Fundamentals\n\n## Basic Calculations\n- Finding X% of Y\n- What % is X of Y\n- Equating percentages (e.g., 15% of Y = 21% of Z)\n\n## Successive Percentage Change\nWhen a value is increased/decreased multiple times successively:\n- Use the formula: a + b + (ab/100)\n- Example: 10% increase then 10% decrease results in a net 1% decrease.\n\n## Consumption & Expenditure\nIf price increases by R%, consumption must be reduced by (R/(100+R)) × 100% to keep expenditure constant.",
            hasCodingProblem: false
          },
          {
            id: "apt-perc-2",
            title: "Applications: Exams, Votes & Profit",
            duration: 45,
            content: "# Percentage Applications\n\n## Examinations & Passing Marks\n- Problems where a student fails by X marks or passes by Y marks above the threshold.\n- Equate the passing marks to find the maximum marks.\n\n## Elections & Voting\n- Calculate total votes when winning/losing margins and vote percentages are given.\n\n## Set Theory & Venn Diagrams\n- Use n(A ∪ B) = n(A) + n(B) - n(A ∩ B) for problems like 'X% fail in Math, Y% fail in Science'.\n\n## Profit, Loss & Salary\n- Salary comparisons: If A is R% more than B, B is (R/(100+R)) × 100% less than A.\n- Calculating CP and SP using percentage profit/loss.",
            hasCodingProblem: false
          },
          {
            id: "apt-perc-3",
            title: "Practice Questions",
            duration: 60,
            content: "# Practice Questions: Percentage\n\n**Q1:** 56% of 'Y' is 182. What is 'Y'?\n<details><summary>View Solution</summary>(56/100) × Y = 182 ⟹ Y = (182 × 100) / 56 = 325</details>\n\n**Q2:** What % is 42 of 336?\n<details><summary>View Solution</summary>(42 / 336) × 100 = 12.5%</details>\n\n**Q3:** If 15% of 'Y' is same as 21% of 'Z', then 12.5% of 'Y' is equal to what % of 'Z'?\n<details><summary>View Solution</summary>15Y = 21Z ⟹ Y = (21/15)Z. Then 12.5% of Y = 12.5 × (21/15) % of Z = 17.5% of Z.</details>\n\n**Q4:** If price of rice is 30% less than that of wheat, then price of wheat is how much % more than that of rice?\n<details><summary>View Solution</summary>Let wheat = 100, then rice = 70. Wheat is 30 more than rice. % more = (30/70) × 100 = 42.85%</details>\n\n**Q5:** The price of apple is first increased by 10% and then decreased by 10%. What is the net change in price?\n<details><summary>View Solution</summary>Let initial = 100. After 10% increase = 110. After 10% decrease = 110 - 11 = 99. Change = 1% decrease.</details>\n\n**Q6:** The price of sugar is raised by 25%. By how much % should a person reduce his consumption so his expenditure remains the same?\n<details><summary>View Solution</summary>(R / (100+R)) × 100 = (25 / 125) × 100 = 20% reduction.</details>\n\n**Q7:** Yash has to score 40% marks to pass. He gets 20 marks and fails by 40 marks. What is the max marks of the exam?\n<details><summary>View Solution</summary>Passing marks = 20 + 40 = 60. Let max marks be M. 40% of M = 60 ⟹ M = 150.</details>\n\n**Q8:** In a class, 15% of students fail in Science, 25% in Maths, and 10% in both. How much % passed in both?\n<details><summary>View Solution</summary>Fail in at least one = n(S ∪ M) = 15 + 25 - 10 = 30%. Passed in both = 100% - 30% = 70%.</details>\n\n**Q9:** In an election, Sneha got 40% of total votes and lost by 1000 votes. What is the total number of votes cast?\n<details><summary>View Solution</summary>Winner got 60%. Margin = 60% - 40% = 20%. 20% of Total = 1000 ⟹ Total = 5000 votes.</details>\n\n**Q10:** If 20% of an electricity bill is deducted, ₹100 is still to be paid. What was the original bill?\n<details><summary>View Solution</summary>80% of Bill = 100 ⟹ Bill = (100 × 100) / 80 = ₹125.</details>",
            hasCodingProblem: false
          }
        ]
      },
      {
        id: "apt-ratio",
        title: "Ratio & Proportion",
        topics: [
          {
            id: "apt-ratio-1",
            title: "Basic Ratios & Proportions",
            duration: 45,
            content: "# Ratio & Proportion Fundamentals\n\n## Basic Ratios\n- Ratio represents the comparison of quantities.\n- Altering ratios by adding/subtracting numbers from numerator and denominator.\n- Combining ratios: If A:B and B:C are given, make B the same to find A:B:C.\n\n## Mean & Fourth Proportions\n- **Mean Proportion** of a and b is √(ab).\n- **Fourth Proportion** of a, b, c is x where a:b = c:x (so x = bc/a).\n\n## Theorem of Equal Ratios\nIf a/b = c/d = e/f = k, then k = (a+c+e)/(b+d+f).",
            hasCodingProblem: false
          },
          {
            id: "apt-ratio-2",
            title: "Distribution & Word Problems",
            duration: 45,
            content: "# Ratio Applications\n\n## Division & Distribution\n- Dividing an amount (e.g., ₹8400) among A, B, C, D in a specific ratio.\n- Convert fractional ratios (like 1/2 : 2/3 : 3/4) to integer ratios by multiplying with LCM.\n\n## Income, Expenditure & Savings\n- Income = Expenditure + Savings\n- Solve using equations: (Income1 - Savings1) / (Income2 - Savings2) = Ratio of Expenditure.\n\n## Compound Ratios\n- If a:b and c:d are ratios, the compound ratio is ac:bd.",
            hasCodingProblem: false
          },
          {
            id: "apt-ratio-3",
            title: "Practice Questions",
            duration: 60,
            content: "# Practice Questions: Ratio & Proportion\n\n**Q1:** Ratio of two numbers is 3:8. On adding 5 to both, the ratio becomes 2:5. Which is the smallest number?\n<details><summary>View Solution</summary>(3x + 5)/(8x + 5) = 2/5 ⟹ 15x + 25 = 16x + 10 ⟹ x = 15. Smallest number = 3x = 45.</details>\n\n**Q2:** Divide ₹3395 in the ratio 42:32:23.\n<details><summary>View Solution</summary>Total parts = 42 + 32 + 23 = 97. 1 part = 3395 / 97 = 35. Shares = 42×35, 32×35, 23×35 = ₹1470, ₹1120, ₹805.</details>\n\n**Q3:** If A:B = 3:7 and B:C = 9:5, find A:B:C.\n<details><summary>View Solution</summary>Make B equal: A:B = 27:63, B:C = 63:35. So A:B:C = 27:63:35.</details>\n\n**Q4:** The sum of three numbers is 285. Ratio between 1st & 2nd is 3:7 and 2nd & 3rd is 6:5. Find the 3rd number.\n<details><summary>View Solution</summary>Combine ratios: 1st:2nd:3rd = 18:42:35. Total parts = 95. 1 part = 285/95 = 3. 3rd number = 35 × 3 = 105.</details>\n\n**Q5:** Income ratio of Ramesh & Suresh is 5:6. Spending ratio is 7:9. Ramesh saves 4000 and Suresh saves 3000. Find their incomes.\n<details><summary>View Solution</summary>(5x - 4000)/(6x - 3000) = 7/9 ⟹ 45x - 36000 = 42x - 21000 ⟹ 3x = 15000 ⟹ x = 5000. Incomes: Ramesh = 25000, Suresh = 30000.</details>\n\n**Q6:** What is the fourth proportion of 9, 13, and 153?\n<details><summary>View Solution</summary>9/13 = 153/x ⟹ 9x = 1989 ⟹ x = 221.</details>\n\n**Q7:** Find the mean proportion of 7 and 63.\n<details><summary>View Solution</summary>Mean proportion = √(7 × 63) = √441 = 21.</details>\n\n**Q8:** If 10/13 = 11/28 = 21/11 = k. Find k.\n<details><summary>View Solution</summary>By Theorem of Equal Ratios, k = (10+11+21)/(13+28+11) = 42/52 = 21/26.</details>\n\n**Q9:** In a library, the ratio of storybooks to non-storybooks was 4:3. Total storybooks was 1248. After buying some more storybooks, the ratio became 5:3. Find the number of storybooks bought.\n<details><summary>View Solution</summary>Initial non-storybooks = (3/4) × 1248 = 936. New ratio = (1248+x)/936 = 5/3 ⟹ 3744 + 3x = 4680 ⟹ x = 312.</details>\n\n**Q10:** ₹8400 is divided among A, B, C, D such that A:B=2:3, B:C=4:5, C:D=6:7. What is A's share?\n<details><summary>View Solution</summary>Combined ratio A:B:C:D = 16:24:30:35. Total parts = 105. A's share = (16/105) × 8400 = ₹1280.</details>",
            hasCodingProblem: false
          }
        ]
      },
      {
        id: "apt-pnc",
        title: "Permutations & Combinations",
        topics: [
          {
            id: "apt-pnc-1",
            title: "Fundamentals & Factorials",
            duration: 45,
            content: "# P&C Fundamentals\n\n## Factorials\n- n! = n × (n-1) × ... × 1\n- 0! = 1\n\n## Permutations (Arrangements)\n- nPr = n! / (n-r)!\n- Used when order MATTERS.\n\n## Combinations (Selections)\n- nCr = n! / (r!(n-r)!)\n- Used when order DOES NOT MATTER.\n- Property: nCr = nC(n-r)\n\n## Solving Equations\n- Simplify factorial equations by expanding the larger factorial until it matches the smaller one to cancel out terms.",
            hasCodingProblem: false
          },
          {
            id: "apt-pnc-2",
            title: "Arrangements & Selections",
            duration: 45,
            content: "# Advanced P&C\n\n## Word Arrangements (Anagrams)\n- Arranging letters of a word (e.g., HISTORY, ALGORITHM).\n- Conditions: Vowels always together, consonants at even positions, etc.\n- Group elements together (tie them in a string) if they must stay together.\n\n## Number Formation\n- Forming N-digit numbers using given digits with/without repetition.\n- Constraints: Numbers greater than 400, divisible by 5, etc.\n\n## Committee Selections\n- Selecting a team from a group of Men and Women.\n- Handling 'at least' or 'at most' conditions by summing multiple cases.\n\n## Logical Puzzles\n- Finding the maximum number of false trials to open a lock with multiple rings.",
            hasCodingProblem: false
          },
          {
            id: "apt-pnc-3",
            title: "Practice Questions",
            duration: 60,
            content: "# Practice Questions: Permutations & Combinations\n\n**Q1:** Find n: n / 8! = 3 / 6! + 1 / 4!\n<details><summary>View Solution</summary>n = 8! × (3/6! + 1/4!) = (8×7×3) + (8×7×6×5) = 168 + 1680 = 1848.</details>\n\n**Q2:** Solve for n: (n+1)! = 42 × (n-1)!\n<details><summary>View Solution</summary>(n+1)(n)(n-1)! = 42(n-1)! ⟹ n(n+1) = 42 ⟹ n² + n - 42 = 0 ⟹ (n+7)(n-6) = 0. Since n>0, n = 6.</details>\n\n**Q3:** Solve for n: (17-n)! / (14-n)! = 5!\n<details><summary>View Solution</summary>(17-n)(16-n)(15-n) = 120 = 6×5×4. So 17-n = 6 ⟹ n = 11.</details>\n\n**Q4:** How many 3-digit numbers can be formed using digits 2,3,4,5,6 if repetition is allowed?\n<details><summary>View Solution</summary>3 places. Each place can be filled in 5 ways. 5 × 5 × 5 = 125 numbers.</details>\n\n**Q5:** How many 3-digit numbers can be formed using 0,1,3,5,6 if repetition is NOT allowed?\n<details><summary>View Solution</summary>Hundreds place can't be 0 (4 ways). Tens place (4 ways left). Units place (3 ways). 4 × 4 × 3 = 48 numbers.</details>\n\n**Q6:** A letter \"lock\" contains 3 rings and each ring contains 5 different letters. Determine the max number of false trials before the lock is opened.\n<details><summary>View Solution</summary>Total possible combinations = 5 × 5 × 5 = 125. One is the correct combination. False trials = 125 - 1 = 124.</details>\n\n**Q7:** How many numbers between 100 and 1000 will have 4 in the units place if digits can be repeated?\n<details><summary>View Solution</summary>3-digit numbers. Units place = 1 way (4). Hundreds place = 9 ways (1-9). Tens place = 10 ways (0-9). 9 × 10 × 1 = 90 numbers.</details>\n\n**Q8:** If numbers are formed using digits 2,3,4,5,6 without repetition, how many of them will exceed 400?\n<details><summary>View Solution</summary>3-digit exceed 400: Hundreds = 3 ways (4,5,6), Tens = 4 ways, Units = 3 ways ⟹ 36.\n4-digit: 5×4×3×2 = 120.\n5-digit: 5! = 120.\nTotal = 120 + 120 + 36 = 276.</details>\n\n**Q9:** Find the number of arrangements of the word \"ALGORITHM\" if vowels are always together.\n<details><summary>View Solution</summary>Vowels = A,O,I. Consonants = L,G,R,T,H,M. Treat vowels as 1 unit. Total units = 6 + 1 = 7. Arrangements = 7! × 3! = 5040 × 6 = 30240.</details>\n\n**Q10:** A group contains 9 men and 6 women. A team of 6 is to be selected. How many selections will have at least 3 women?\n<details><summary>View Solution</summary>Cases: (3W,3M), (4W,2M), (5W,1M), (6W,0M).\n(6C3 × 9C3) + (6C4 × 9C2) + (6C5 × 9C1) + (6C6 × 9C0) = 1680 + 540 + 54 + 1 = 2275.</details>",
            hasCodingProblem: false
          }
        ]
      },
      {
        id: "apt-approx",
        title: "Approximation & Estimation",
        topics: [
          {
            id: "apt-approx-1",
            title: "Indices & Fractions",
            duration: 45,
            content: "# Approximation Techniques\n\n## Indices & Surds\n- Simplifying complex roots and powers.\n- Finding the largest/smallest among surds (e.g., √3, ∛2) by making the index of the roots equal (using LCM).\n\n## Fractions & Decimals\n- Converting recurring decimals to fractions (e.g., 0.15268...).\n- Arranging fractions in ascending/descending order.\n- Complex fraction simplification.\n\n## Approximation in Calculations\n- Using closest integer values for fast calculations (e.g., 17.499... ≈ 17.5).",
            hasCodingProblem: false
          },
          {
            id: "apt-approx-2",
            title: "Algebraic Puzzles & Logic",
            duration: 45,
            content: "# Word Problems & Logic\n\n## Algebraic Relations\n- Problems involving sums, products, and sum of reciprocals.\n- Two-digit number reversal problems: (10x + y) vs (10y + x).\n\n## Logic Puzzles\n- **Heads & Legs:** Solving simultaneous equations for animals (e.g., Hens and Goats).\n- Sum of consecutive numbers.\n- Bag shifting puzzles (interchanging quantities).",
            hasCodingProblem: false
          },
          {
            id: "apt-approx-3",
            title: "Practice Questions",
            duration: 60,
            content: "# Practice Questions: Approximation & Estimation\n\n**Q1:** Approximate value: 21.003 × 39.998 - 209.91\n<details><summary>View Solution</summary>≈ 21 × 40 - 210 = 840 - 210 = 630.</details>\n\n**Q2:** What is the largest among √2, ∛3, ∜4, ⁶√6?\n<details><summary>View Solution</summary>LCM of 2,3,4,6 is 12. 2^(6/12), 3^(4/12), 4^(3/12), 6^(2/12) ⟹ 64^(1/12), 81^(1/12), 64^(1/12), 36^(1/12). Largest is 81^(1/12) which is ∛3.</details>\n\n**Q3:** Arrange 3/5, 4/7, 8/9, 9/11 in descending order.\n<details><summary>View Solution</summary>Differences: 5-3=2, 7-4=3, 9-8=1, 11-9=2. Using cross multiplication or converting to decimals: 8/9 (0.88) > 9/11 (0.81) > 3/5 (0.60) > 4/7 (0.57).</details>\n\n**Q4:** Sum of 1/2 + 1/6 + 1/12 + 1/20 + 1/30 = ?\n<details><summary>View Solution</summary>1/(1×2) + 1/(2×3) + ... + 1/(5×6) = (1 - 1/2) + (1/2 - 1/3) + ... + (1/5 - 1/6) = 1 - 1/6 = 5/6.</details>\n\n**Q5:** A two-digit number is reversed. The difference is 36. What is the difference between its digits?\n<details><summary>View Solution</summary>Difference = 9|x - y| = 36 ⟹ |x - y| = 4.</details>\n\n**Q6:** In a farm, there are hens and goats. Total heads = 50, Total legs = 140. Find the number of goats.\n<details><summary>View Solution</summary>Let goats = G. Hens = 50-G. 4G + 2(50-G) = 140 ⟹ 2G + 100 = 140 ⟹ 2G = 40 ⟹ G = 20 goats.</details>\n\n**Q7:** The sum of two numbers is 25 and their product is 144. Find the sum of their reciprocals.\n<details><summary>View Solution</summary>(1/x) + (1/y) = (x+y)/xy = 25/144.</details>\n\n**Q8:** Convert 0.454545... into a fraction.\n<details><summary>View Solution</summary>Let x = 0.4545... ⟹ 100x = 45.4545... ⟹ 99x = 45 ⟹ x = 45/99 = 5/11.</details>\n\n**Q9:** Simplify: (1 - 1/3)(1 - 1/4)(1 - 1/5)...(1 - 1/100)\n<details><summary>View Solution</summary>(2/3) × (3/4) × (4/5) × ... × (99/100). All intermediate terms cancel out = 2/100 = 1/50.</details>\n\n**Q10:** If x + 1/x = 3, find x² + 1/x².\n<details><summary>View Solution</summary>(x + 1/x)² = 9 ⟹ x² + 2 + 1/x² = 9 ⟹ x² + 1/x² = 7.</details>",
            hasCodingProblem: false
          }
        ]
      },
      {
        id: "apt-stats",
        title: "Statistics",
        topics: [
          {
            id: "apt-stats-1",
            title: "Data Representation & Mean",
            duration: 45,
            content: "# Statistics Fundamentals\n\n## Graphical Representation\n- **Pie Charts:** Central angle = (Value / Total) × 360°.\n- Finding values and differences from Pie Chart data.\n\n## Calculating Mean\n- **Raw Data:** Sum of all data / number of data points.\n- **Ungrouped Frequency:** Σ(fi·xi) / Σfi\n- **Grouped Frequency:** Using class marks (midpoints) for calculation.",
            hasCodingProblem: false
          },
          {
            id: "apt-stats-2",
            title: "Median, Mode & Graphs",
            duration: 45,
            content: "# Advanced Central Tendencies\n\n## Median\n- **Raw Data:** Sort in ascending order. Find the middle term (n+1)/2 if odd, average of middle two if even.\n- **Grouped Data:** Formula: L + [((n/2) - CF) / f] × c\n  - Find the median class using Cumulative Frequency (CF).\n\n## Mode\n- **Raw Data:** The value with the highest frequency.\n- **Grouped Data:** Formula: l + [(f1 - f0) / (2f1 - f0 - f2)] × c\n\n## Graphical Solutions\n- **Mode:** Found graphically using Histograms.\n- **Median:** Found graphically using Ogives (Cumulative Frequency Curves).",
            hasCodingProblem: false
          },
          {
            id: "apt-stats-3",
            title: "Practice Questions",
            duration: 60,
            content: "# Practice Questions: Statistics\n\n**Q1:** The mean of 5 numbers is 18. If one number is excluded, the mean becomes 16. Find the excluded number.\n<details><summary>View Solution</summary>Sum of 5 = 90. Sum of 4 = 64. Excluded number = 90 - 64 = 26.</details>\n\n**Q2:** What is the median of 3, 11, 7, 2, 5, 9, 9, 2, 10?\n<details><summary>View Solution</summary>Sorted: 2, 2, 3, 5, 7, 9, 9, 10, 11. n=9. Median is the 5th term = 7.</details>\n\n**Q3:** Find the mode of 12, 15, 11, 12, 19, 15, 12, 19.\n<details><summary>View Solution</summary>12 appears 3 times (highest frequency). Mode = 12.</details>\n\n**Q4:** A pie chart represents total expenditure of ₹72000. If Education has a central angle of 80°, what is the expenditure on Education?\n<details><summary>View Solution</summary>(80 / 360) × 72000 = (2/9) × 72000 = ₹16000.</details>\n\n**Q5:** For a symmetrical distribution, mean = median = mode. True or False?\n<details><summary>View Solution</summary>True. In a perfectly symmetrical normal distribution, all three central tendencies are equal.</details>\n\n**Q6:** Find the mean of first 10 prime numbers.\n<details><summary>View Solution</summary>Primes: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29. Sum = 129. Mean = 129 / 10 = 12.9.</details>\n\n**Q7:** If the mean of x, x+3, x+6, x+9, x+12 is 10, find x.\n<details><summary>View Solution</summary>Sum = 5x + 30. Mean = (5x+30)/5 = x+6. x+6 = 10 ⟹ x = 4.</details>\n\n**Q8:** In a grouped data frequency, which graphical method is used to find the Median?\n<details><summary>View Solution</summary>Cumulative Frequency Curves, also known as Ogives (less-than and more-than ogives intersecting at the median).</details>\n\n**Q9:** In a pie chart, if Food is 25% and Rent is 15%, what is the difference in their central angles?\n<details><summary>View Solution</summary>Difference = 10%. Angle = 10% of 360° = 36°.</details>\n\n**Q10:** The relationship is: Mode = 3 Median - 2 Mean. If Mean = 4, Median = 5, find Mode.\n<details><summary>View Solution</summary>Mode = 3(5) - 2(4) = 15 - 8 = 7.</details>",
            hasCodingProblem: false
          }
        ]
      },
      {
        id: "apt-binomial",
        title: "Binomial Expansion",
        topics: [
          {
            id: "apt-binomial-1",
            title: "Pascal's Triangle & Expansion",
            duration: 45,
            content: "# Binomial Expansion Basics\n\n## Pascal's Triangle\n- A triangular array where each number is the sum of the two numbers directly above it.\n- Gives the coefficients for (a+b)^n.\n- The expansion of power 'n' will always have 'n+1' terms.\n\n## General Expansion\n- (a+b)³ = a³ + 3a²b + 3ab² + b³\n- Using coefficients from Pascal's Triangle for higher powers.",
            hasCodingProblem: false
          },
          {
            id: "apt-binomial-2",
            title: "Specific Terms & Approximations",
            duration: 45,
            content: "# Advanced Binomial Theorem\n\n## Finding Specific Terms\n- General term formula: T(r+1) = nCr · a^(n-r) · b^r\n- To find the k-th term, use r = k - 1.\n\n## Finding the Middle Term\n- If n is even, there is 1 middle term at (n/2 + 1).\n- If n is odd, there are 2 middle terms at ((n+1)/2) and ((n+1)/2 + 1).\n\n## Numerical Approximation\n- Expanding decimals like (1.1)⁴ or (0.9)⁵ by writing them as (1 + 0.1)⁴ and (1 - 0.1)⁵.\n- Allows for quick and accurate calculation of higher powers of decimals.",
            hasCodingProblem: false
          },
          {
            id: "apt-binomial-3",
            title: "Practice Questions",
            duration: 60,
            content: "# Practice Questions: Binomial Expansion\n\n**Q1:** Expand (x + y)³.\n<details><summary>View Solution</summary>x³ + 3x²y + 3xy² + y³.</details>\n\n**Q2:** What is the 4th term in the expansion of (a + b)⁶?\n<details><summary>View Solution</summary>T4 = T(3+1) = 6C3 · a³ · b³ = 20a³b³.</details>\n\n**Q3:** How many terms are there in the expansion of (2x + 3y)¹⁰?\n<details><summary>View Solution</summary>Power is n=10. Number of terms = n + 1 = 11.</details>\n\n**Q4:** Find the middle term in the expansion of (x + 2y)⁸.\n<details><summary>View Solution</summary>n=8 (even). Middle term is (8/2 + 1) = 5th term. T5 = 8C4 · x⁴ · (2y)⁴ = 70 × 16 x⁴y⁴ = 1120 x⁴y⁴.</details>\n\n**Q5:** Use binomial approximation to find the value of (1.02)⁴ to two decimal places.\n<details><summary>View Solution</summary>(1 + 0.02)⁴ ≈ 1 + 4(0.02) = 1.08.</details>\n\n**Q6:** In Pascal's triangle, what is the sum of the elements in the 5th row (starting with n=0)?\n<details><summary>View Solution</summary>Sum of coefficients for power n is 2^n. For n=5, 2⁵ = 32. (1+5+10+10+5+1 = 32).</details>\n\n**Q7:** Find the coefficient of x³y² in the expansion of (x + y)⁵.\n<details><summary>View Solution</summary>Term is 5C2 · x³ · y² = 10 x³y². Coefficient is 10.</details>\n\n**Q8:** What are the two middle terms in the expansion of (a + b)⁷?\n<details><summary>View Solution</summary>n=7 (odd). Middle terms are at (7+1)/2 = 4th term and 5th term. T4 = 35a⁴b³, T5 = 35a³b⁴.</details>\n\n**Q9:** Find the approximate value of (0.99)³ using binomial theorem.\n<details><summary>View Solution</summary>(1 - 0.01)³ ≈ 1 - 3(0.01) = 0.97.</details>\n\n**Q10:** Expand (1 - x)⁴.\n<details><summary>View Solution</summary>1 - 4x + 6x² - 4x³ + x⁴.</details>",
            hasCodingProblem: false
          }
        ]
      },
      {
        id: "1",
        title: "DI Fundamentals",
        topics: [
          { id: "1-1", title: "Table-based DI", duration: 45, content: "# Table-based Data Interpretation\n\n## What is DI?\nData Interpretation involves analyzing data presented in various formats (tables, charts, graphs) to answer questions.\n\n### Table Reading Strategy\n1. **Scan headers** first — understand rows and columns\n2. **Identify units** — %, absolute numbers, ratios\n3. **Note trends** — increasing, decreasing, constant\n4. **Calculate only what's asked** — don't compute everything\n\n### Example Table\n| Year | Revenue (₹Cr) | Profit (₹Cr) | Employees |\n|------|---------------|---------------|----------|\n| 2020 | 450 | 52 | 1200 |\n| 2021 | 520 | 68 | 1350 |\n| 2022 | 610 | 85 | 1500 |\n| 2023 | 700 | 98 | 1620 |\n\n**Q: What is the profit margin in 2022?**\nProfit Margin = (85/610) × 100 = **13.93%**\n\n**Q: Revenue growth rate from 2021 to 2022?**\nGrowth = ((610-520)/520) × 100 = **17.31%**", hasCodingProblem: false },
          { id: "1-2", title: "Bar Graph DI", duration: 45, content: "# Bar Graph Interpretation\n\n## Reading Bar Graphs\n- Compare heights for relative comparisons\n- Use approximate values for quick estimation\n- Stacked bars → part-to-whole relationships\n- Grouped bars → category comparisons\n\n### Quick Tips\n- For % change: (New - Old) / Old × 100\n- For CAGR: (Final/Initial)^(1/n) - 1\n- Always check the Y-axis scale — it can be misleading!", hasCodingProblem: false },
          { id: "1-3", title: "Pie Chart DI", duration: 45, content: "# Pie Chart Interpretation\n\n## Key Concepts\n- Full circle = 360° = 100%\n- 1% = 3.6°\n- Compare slices for proportions\n\n### Common Question Types\n1. What percentage does X represent?\n2. What is the difference between X and Y?\n3. What is the ratio of X to Y?\n4. If total = N, find the value of each segment\n\n### Shortcut\nFor quick percentage estimation:\n- 1/4 = 25%\n- 1/3 ≈ 33.33%\n- 1/5 = 20%\n- 1/8 = 12.5%", hasCodingProblem: false },
        ],
      },
      {
        id: "2",
        title: "Logical Reasoning",
        topics: [
          { id: "2-1", title: "Linear & Circular Arrangements", duration: 45, content: "# Seating Arrangements\n\n## Linear Arrangement\nPeople sitting in a row — fixed directions (left/right).\n\n### Strategy\n1. Start with the person who has the **most constraints**\n2. Use a number line to position people\n3. Mark definite positions first\n4. Eliminate impossible arrangements\n\n## Circular Arrangement\nPeople sitting around a table.\n\n### Key Difference\n- In circular, one person is **fixed** as reference\n- Total arrangements = (n-1)!\n- Clockwise & counterclockwise may or may not be same", hasCodingProblem: false },
          { id: "2-2", title: "Blood Relations", duration: 45, content: "# Blood Relations\n\n## Family Tree Mapping\nDraw the family tree top-down:\n- Male: □, Female: ○\n- Marriage: ——\n- Parent-child: |\n\n### Common Relations\n| Relation | Meaning |\n|----------|--------|\n| Paternal uncle | Father's brother |\n| Maternal aunt | Mother's sister |\n| Nephew | Brother/Sister's son |\n| Cousin | Uncle/Aunt's child |\n\n### Coded Relations\nWhen relations use symbols (+, -, ×, ÷), first decode the symbols then draw the tree.", hasCodingProblem: false },
          { id: "2-3", title: "Puzzles — Binary Logic", duration: 45, content: "# Binary Logic Puzzles\n\n## Yes/No, True/False Problems\n\n### Strategy\n1. Assume one person tells truth\n2. Check if the assumption leads to contradiction\n3. If contradiction → flip assumption\n4. Use a truth table to track\n\n### Classic Type: Knights & Knaves\n- Knights ALWAYS tell truth\n- Knaves ALWAYS lie\n- Use logical deduction to identify who is who", hasCodingProblem: false },
        ],
      },
      {
        id: "3",
        title: "Time Management & Strategy",
        topics: [
          { id: "3-1", title: "Speed Math & Mental Calculations", duration: 45, content: "# Speed Math Techniques\n\n## Multiplication Shortcuts\n- **× 11:** 26 × 11 → 2(2+6)6 = 286\n- **× 5:** Divide by 2, multiply by 10\n- **× 25:** Divide by 4, multiply by 100\n- **Squaring numbers ending in 5:** 35² → 3×4=12, append 25 → 1225\n\n## Percentage Shortcuts\n- 10% of X = X/10\n- 5% = half of 10%\n- 15% = 10% + 5%\n- 1% = X/100\n- 33.33% = X/3\n- 12.5% = X/8\n\n## Division Shortcuts\n- Divide by 5: multiply by 2, divide by 10\n- Divide by 25: multiply by 4, divide by 100", hasCodingProblem: false },
          { id: "3-2", title: "Exam Strategy & Time Allocation", duration: 45, content: "# Exam Strategy\n\n## The 4-Set-40-Minute Rule\nFor DILR sections: Aim to solve 4 sets in 40 minutes.\n\n### Set Selection Strategy\n1. **Scan all sets** (2 min) — read first lines only\n2. **Classify:** Easy (🟢) / Medium (🟡) / Hard (🔴)\n3. **Attempt order:** 🟢 → 🟡 → 🔴\n4. **Time per set:** 8-10 min max\n\n### Smart Skipping\n- If stuck for > 2 min on a question → SKIP\n- Skip sets with too many variables\n- Skip sets requiring complex calculations\n\n### Option Elimination\n- In DI: Use approximation to eliminate 2 options\n- In LR: Check extreme cases first\n- In puzzles: Start with the most constrained variable", hasCodingProblem: false },
          { id: "3-3", title: "Mock Test Strategy", duration: 45, content: "# Full Mock Test Strategy\n\n## Before the Test\n- Get 7+ hours of sleep\n- Light meal 1 hour before\n- Arrive 15 min early\n\n## During the Test\n1. **First pass (60%):** Attempt easy questions\n2. **Second pass (30%):** Attempt medium questions\n3. **Final pass (10%):** Attempt remaining if time permits\n\n## After the Test\n- Review every wrong answer\n- Log mistake types: Silly, Conceptual, Time-pressure\n- Track improvement across mocks\n\n## Error Tracking Template\n| Q# | Type | Mistake | Correction |\n|----|------|---------|------------|\n| 15 | DI | Misread unit | Check units first |\n| 23 | LR | Wrong assumption | List all constraints |", hasCodingProblem: false },
        ],
      },
    ],
  },
  {
    id: "products-pricing",
    title: "Products & Pricing",
    subtitle: "How Products are Built + Payment Stack",
    icon: "💡",
    color: "#FFA726",
    colorLight: "rgba(255, 167, 38, 0.15)",
    gradient: "linear-gradient(135deg, #FFA726, #ff8f00)",
    hasCoding: false,
    modules: [
      {
        id: "1",
        title: "Product Building Fundamentals",
        topics: [
          { id: "1-1", title: "Problem Definition & Target Audience", duration: 45, content: "# Problem Definition & Target Audience\n\n## The Foundation of Every Great Product\nEvery successful product starts with a **clearly defined problem** and a **specific target audience**.\n\n### Problem Statement Framework\n> \"[Target users] need a way to [do something] because [reason/pain point].\"\n\n**Example:** \"College students need a way to organize their study materials because managing multiple subjects across semesters is overwhelming and leads to missed deadlines.\"\n\n### Identifying Your Target Audience\n1. **Demographics:** Age, location, income, education\n2. **Psychographics:** Values, interests, behaviors\n3. **Pain Points:** What frustrates them daily?\n4. **Goals:** What are they trying to achieve?\n\n### User Persona Template\n| Attribute | Detail |\n|-----------|--------|\n| Name | \"Student Saiyash\" |\n| Age | 19-22 |\n| Goal | Ace semester exams |\n| Pain Point | Too many subjects, no structure |\n| Tech Comfort | High |", hasCodingProblem: false },
          { id: "1-2", title: "Market Research & Competition", duration: 45, content: "# Market Research & Competition Analysis\n\n## Competitive Analysis Framework\n\n### Direct vs Indirect Competitors\n- **Direct:** Solve the same problem for the same audience (Notion, Quizlet)\n- **Indirect:** Solve a related problem (YouTube tutorials, textbooks)\n\n### SWOT Analysis\n| | Helpful | Harmful |\n|---|---------|--------|\n| Internal | **Strengths** | **Weaknesses** |\n| External | **Opportunities** | **Threats** |\n\n### Blue Ocean Strategy\nDon't compete in a crowded market (Red Ocean). Instead, create a new market space (Blue Ocean):\n- **Eliminate** features nobody uses\n- **Reduce** features that are overbuilt\n- **Raise** features above industry standard\n- **Create** features that don't exist yet", hasCodingProblem: false },
        ],
      },
      {
        id: "2",
        title: "Pricing Strategies",
        topics: [
          { id: "2-1", title: "Cost-Based & Value-Based Pricing", duration: 45, content: "# Pricing Strategies\n\n## Cost-Based Pricing\nPrice = Cost + Markup\n\n**Example:** If building costs ₹10,000/month and you want 30% margin:\nPrice = ₹10,000 × 1.30 = ₹13,000/month\n\n## Value-Based Pricing\nPrice based on **perceived value to customer**, not cost.\n\n**Example:** A tool that saves a company 10 hours/week × ₹500/hour = ₹5,000/week value.\nPricing at ₹2,000/month is a no-brainer for them!\n\n## Common Pricing Models\n| Model | Example | Best For |\n|-------|---------|----------|\n| Freemium | Spotify, Slack | Wide adoption |\n| Subscription | Netflix, SaaS | Recurring revenue |\n| Pay-per-use | AWS, Twilio | Variable usage |\n| One-time | Apps, licenses | Simple products |\n| Tiered | Notion, GitHub | Different segments |", hasCodingProblem: false },
          { id: "2-2", title: "Dynamic Pricing & Payment Stack", duration: 45, content: "# Dynamic Pricing & Payment Stack\n\n## Dynamic Pricing\nPrices change based on demand, time, user segment.\n\n**Examples:**\n- Uber surge pricing\n- Airline ticket pricing\n- Hotel room rates\n\n## Payment Stack Implementation\n\n### Payment Gateway Options\n| Gateway | Best For | Fees |\n|---------|----------|------|\n| Razorpay | India | 2% per txn |\n| Stripe | Global | 2.9% + 30¢ |\n| PayPal | International | 2.9% + fixed |\n| Cashfree | India | 1.9% per txn |\n\n### Integration Flow\n1. User clicks \"Pay\"\n2. Create order on your server\n3. Redirect to payment gateway\n4. Gateway processes payment\n5. Webhook confirms payment\n6. Update order status\n7. Send confirmation email", hasCodingProblem: false },
        ],
      },
    ],
  },
  {
    id: "german-a1",
    title: "German A1",
    subtitle: "Deutsch Meister",
    icon: "🇩🇪",
    color: "#66BB6A",
    colorLight: "rgba(102, 187, 106, 0.15)",
    gradient: "linear-gradient(135deg, #66BB6A, #43a047)",
    hasCoding: false,
    isExternal: true,
    externalUrl: "https://deutsch-meister-xi.vercel.app",
    modules: [
      {
        id: "1",
        title: "Basics & Greetings",
        topics: [
          { id: "1-1", title: "Greetings & Introductions", duration: 90, content: "# Begrüßungen (Greetings)\n\n## Basic Greetings\n| German | English | Usage |\n|--------|---------|-------|\n| Hallo | Hello | Informal |\n| Guten Morgen | Good morning | Formal/Informal |\n| Guten Tag | Good day | Formal |\n| Guten Abend | Good evening | Formal |\n| Tschüss | Bye | Informal |\n| Auf Wiedersehen | Goodbye | Formal |\n\n## Self Introduction\n- **Ich heiße...** = My name is...\n- **Ich bin...** = I am...\n- **Ich komme aus...** = I come from...\n- **Ich wohne in...** = I live in...\n\n### Practice Dialog\n> A: Hallo! Ich heiße Anna. Wie heißt du?\n> B: Hallo Anna! Ich heiße Saiyash. Ich komme aus Indien.\n> A: Freut mich! (Nice to meet you!)\n\n📌 **Study on Deutsch Meister** for interactive practice!", hasCodingProblem: false },
          { id: "1-2", title: "Alphabet & Numbers", duration: 180, content: "# Das Alphabet & Zahlen\n\n## Special German Letters\n- **ä** (ae) — like 'e' in 'bed'\n- **ö** (oe) — like 'ur' in 'burn'\n- **ü** (ue) — like 'ew' in 'few'\n- **ß** (ss) — sharp S\n\n## Numbers 1-20\n| # | German | # | German |\n|---|--------|---|--------|\n| 1 | eins | 11 | elf |\n| 2 | zwei | 12 | zwölf |\n| 3 | drei | 13 | dreizehn |\n| 4 | vier | 14 | vierzehn |\n| 5 | fünf | 15 | fünfzehn |\n| 6 | sechs | 16 | sechzehn |\n| 7 | sieben | 17 | siebzehn |\n| 8 | acht | 18 | achtzehn |\n| 9 | neun | 19 | neunzehn |\n| 10 | zehn | 20 | zwanzig |", hasCodingProblem: false },
        ],
      },
      {
        id: "2",
        title: "Daily Life & Time",
        topics: [
          { id: "2-1", title: "Days, Months & Vocabulary", duration: 180, content: "# Wochentage & Monate\n\n## Days of the Week\n| German | English |\n|--------|---------|\n| Montag | Monday |\n| Dienstag | Tuesday |\n| Mittwoch | Wednesday |\n| Donnerstag | Thursday |\n| Freitag | Friday |\n| Samstag | Saturday |\n| Sonntag | Sunday |\n\n## Months\nJanuar, Februar, März, April, Mai, Juni, Juli, August, September, Oktober, November, Dezember\n\n## Useful Vocabulary\n- **heute** = today\n- **morgen** = tomorrow\n- **gestern** = yesterday\n- **die Woche** = the week\n- **der Monat** = the month", hasCodingProblem: false },
          { id: "2-2", title: "Telling Time & Hobbies", duration: 150, content: "# Die Uhrzeit & Hobbys\n\n## Telling Time\n- **Wie spät ist es?** = What time is it?\n- Es ist **drei Uhr** = It is 3 o'clock\n- Es ist **halb vier** = It is 3:30 (half of four)\n- Es ist **Viertel nach drei** = It is 3:15\n- Es ist **Viertel vor vier** = It is 3:45\n\n## Hobbies\n- Ich spiele gern Fußball = I like playing football\n- Ich lese gern = I like reading\n- Ich höre gern Musik = I like listening to music\n- Ich koche gern = I like cooking\n- Ich programmiere gern = I like programming 😄", hasCodingProblem: false },
        ],
      },
    ],
  },
];

// Helper function to get a subject by ID
export function getSubject(subjectId) {
  return subjects.find((s) => s.id === subjectId);
}

// Helper function to get a module by IDs
export function getModule(subjectId, moduleId) {
  const subject = getSubject(subjectId);
  if (!subject) return null;
  return subject.modules.find((m) => m.id === moduleId);
}

// Helper function to get a topic
export function getTopic(subjectId, moduleId, topicId) {
  const subModule = getModule(subjectId, moduleId);
  if (!subModule) return null;
  return subModule.topics.find((t) => t.id === topicId);
}

// Get total topics for a subject
export function getTotalTopics(subjectId) {
  const subject = getSubject(subjectId);
  if (!subject) return 0;
  return subject.modules.reduce((sum, m) => sum + m.topics.length, 0);
}

// Get all topic IDs for a subject (flat list)
export function getAllTopicIds(subjectId) {
  const subject = getSubject(subjectId);
  if (!subject) return [];
  return subject.modules.flatMap((m) => m.topics.map((t) => t.id));
}
