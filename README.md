# Jekyll Compose

A powerful Obsidian plugin that brings Jekyll blog post management directly into your vault. Create drafts, publish posts, and manage your Jekyll blog content seamlessly without leaving Obsidian.

## Features

- **Create Jekyll drafts** with automatic front matter generation
- **Create Jekyll posts** with date-prefixed filenames
- **Publish drafts** to posts with proper date formatting
- **Unpublish posts** back to drafts
- **Customizable folder structure** for posts and drafts
- **Auto-formatted filenames** using kebab-case
- **Deafult frontmatter** including the title, date, and more

## Coming Soon Features
- **Template support** for consistent front matter

## Usage

The plugin adds four commands to Obsidian's command palette. Simply open the command palette to start using the jekyll compose commands:

| Command | Description |
|---------|-------------|
| **Create draft** | Creates a new Jekyll draft in your drafts folder. Opens a prompt for the title. |
| **Create post** | Creates a new Jekyll post in your posts folder with today's date. Opens a prompt for the title. |
| **Publish draft** | Converts a draft to a published post by adding a date prefix and moving it to the posts folder. |
| **Unpublish post** | Moves a post back to drafts by removing the date prefix. |

### Examples

- **Drafts**: Created as `my-post-title.md` in the drafts folder
- **Posts**: Created as `YYYY-MM-DD-my-post-title.md` in the posts folder
- **Auto-format**: Titles are automatically converted to kebab-case for filenames
- **Front matter**: Automatically generated

## Installation

### From Obsidian Community Plugins (Coming Soon)

1. Open **Settings → Community plugins**
2. Select **Browse** and search for "Jekyll Compose"
3. Select **Install** then **Enable**

### Manual Installation

1. Download the latest release from the [releases page](https://github.com/knightartefact/jekyll-compose-obsidian/releases)
2. Extract the files to your vault's plugins folder: `<vault>/.obsidian/plugins/jekyll-compose-obsidian/`
3. Reload Obsidian
4. Enable the plugin in **Settings → Community plugins**

## Configuration

Configure the plugin in **Settings → Jekyll Compose**:

### Posts Folder
- **Default**: `_posts`
- Folder where Jekyll posts will be created. Set this to match your Jekyll blog's posts directory

### Drafts Folder
- **Default**: `_drafts`
- Folder where Jekyll drafts will be created. Set this to match your Jekyll blog's drafts directory

### Default Template File
- **Default**: (empty)
- Path to a markdown file to use as a template for new posts and drafts
- Leave empty to use default front matter generation
- Use autocomplete suggestions to select from your template folder

### Default Template Folder
- **Default**: (empty)
- Folder to select template files from
- Makes it easier to find templates when using the template file picker

### Default Date-Time Format
- **Default**: `YYYY-MM-DD HH:mm ZZ`
- Format string for date-time in Jekyll front matter
- Uses [Moment.js formatting](https://momentjs.com/docs/#/displaying/format/)
- Examples:
  - `YYYY-MM-DD HH:mm ZZ` → `2025-12-14 15:30 +00:00`
  - `YYYY-MM-DD` → `2025-12-14`
  - `MMMM DD, YYYY` → `December 14, 2025`

## Workflow Example

### Creating a new blog post

1. Open the command palette (Ctrl/Cmd + P)
2. Select **Jekyll Compose: Create draft**
3. Enter your post title (e.g., "My Amazing Blog Post")
4. The plugin creates `_drafts/my-amazing-blog-post.md` with front matter
5. Write your content
6. When ready to publish, select **Jekyll Compose: Publish draft**
7. Select your draft from the list
8. The file is moved to `_posts/2025-12-14-my-amazing-blog-post.md`

### Starting with a published post

1. Select **Jekyll Compose: Create post**
2. Enter your title
3. File is created directly in `_posts` with today's date

### Moving posts back to drafts

1. Select **Jekyll Compose: Unpublish post**
2. Choose the post to unpublish
3. Date prefix is removed and file moves to `_drafts`

## Requirements

- Obsidian v1.10.0 or higher
- Desktop only (not compatible with mobile)

## Compatibility

This plugin is designed to work with standard Jekyll blog structures. It follows Jekyll conventions:
- Posts in `_posts/` with `YYYY-MM-DD-title.md` format
- Drafts in `_drafts/` without date prefixes
- Front matter in YAML format

## Support

If you encounter any issues or have feature requests, please [open an issue](https://github.com/knightartefact/jekyll-compose-obsidian/issues) on GitHub.

## Development

### Building the plugin

```bash
npm install
npm run dev      # Watch mode for development
npm run build    # Production build
```

### Testing locally

1. Clone this repository to your vault's plugins folder
2. Run `npm install` then `npm run dev`
3. Reload Obsidian
4. Enable the plugin in settings

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

Created by [knightartefact](https://stopaloff.com)

Inspired by the [jekyll-compose](https://github.com/jekyll/jekyll-compose) gem for Jekyll.

---

**Note**: This plugin modifies files in your vault. Always back up your content before using any file management plugin.
