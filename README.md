# bkrte-editor

A powerful and user-friendly Rich Text to HTML Editor built with React.

## Features

### Core Functionality
- **Real-time Conversion**: Instantly converts plain text into structured HTML paragraph format (`<p>`).
- **Smart Formatting**: 
  - Automatically recognizes paragraphs.
  - **Subheading Support**: Lines starting with `#` or standard HTML headers (`<h1>`-`<h6>`) are automatically converted to bold text (`<p><strong>...</strong></p>`).
  - **HTML Paste Support**: Preserves rich text formatting (HTML tags) when pasting from other sources.
  - **Smart Filtering**: Automatically cleans up pasted HTML, keeping only essential tags like `<p>` and `<strong>` for a clean output.

### User Interface
- **Symmetrical Split-Pane Layout**:
  - **Left Panel (Input)**: Where you edit your content.
  - **Right Panel (Output)**: Shows the result.
- **Dual View Modes (Available in both Input and Output panels)**:
  - **Text View**: A WYSIWYG (What You See Is What You Get) style preview. In the input area, this is fully editable!
  - **Code View**: A developer-friendly view showing the raw HTML source code with syntax highlighting (dark theme).
- **Bi-directional Synchronization**: Edits made in "Text View" automatically update the "Code View" source, and vice-versa.
- **Language Support**: One-click switching between English and Chinese interfaces.

### Productivity
- **One-click Copy**: Easily copy the generated HTML code to your clipboard.


## How to Use

1. **Input Content**:
   - Type directly in the **Text View** (left panel) for a visual editing experience.
   - Or switch to **Code View** to paste raw text or HTML code.
   - Use `#` at the start of a line to create a bold heading.
   - Press `Enter` to create new paragraphs.

2. **Check Output**:
   - The **Right Panel** instantly shows the rendered result (Text View) or the generated HTML code (Code View).

3. **Get Code**:
   - Click the "Copy HTML" button to grab the clean, formatted HTML code for use in your projects.

