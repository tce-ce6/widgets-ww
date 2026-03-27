# Pick the Opposite! (WG123)

## Debugging

A global debug method `debugNavigate(query)` is available to quickly jump to a specific option by its name or number. This allows for easier testing without having to click through the game linearly.

### How to Use
Open your browser's developer console and type the following commands as needed:

```javascript
// This will log all available options (their names and numbers) in the console
debugNavigate();

// Navigate directly using the option's number (ID)
debugNavigate(3);

// Navigate directly using the option's name (the target answer word)
debugNavigate('sad');
```

The method will switch the display to the appropriate question immediately.

### Option List Reference
1. small
2. cold
3. sad
4. slow
5. new
6. night
7. dirty
8. down
9. short
10. dry
11. empty
12. light
13. quiet
14. soft
15. closed
16. short
17. thin
18. far
19. late
20. outside
21. back
22. bad
23. weak
24. bottom
25. hard
