#!/usr/bin/env node
import { symlinkSync, existsSync, rmSync } from 'fs'
import { join, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = resolve(fileURLToPath(import.meta.url), '..')
const projectRoot = resolve(__dirname, '..')
const staticDir = join(projectRoot, 'examples/browser/web-app/static')
const srcDir = join(projectRoot, 'src')

/**
 * Create or update a symlink
 * @param {string} symlinkPath - Full path where the symlink should be created
 * @param {string} targetPath - Path the symlink should point to (can be relative)
 * @param {string} description - Description for logging
 */
function createSymlink(symlinkPath, targetPath, description) {
  try {
    // Remove existing symlink or file (check with lstat to detect broken symlinks)
    try {
      const stats = existsSync(symlinkPath) || true
      if (stats) {
        rmSync(symlinkPath, { force: true, recursive: false })
      }
    } catch (e) {
      // File doesn't exist, continue
    }

    // Create symlink
    symlinkSync(targetPath, symlinkPath)
    console.log(`✓ Created symlink: ${description}`)
  } catch (error) {
    console.error(`✗ Failed to create symlink for ${description}:`, error.message)
    process.exit(1)
  }
}

console.log('Setting up symlinks for browser example...\n')

// Create font subdirectory symlinks
const fontDir = join(staticDir, 'font')
const drawerFontDir = join(srcDir, 'drawer/font')

createSymlink(
  join(fontDir, 'chord-letters'),
  join(drawerFontDir, 'chord-letters'),
  'static/font/chord-letters → src/drawer/font/chord-letters'
)

createSymlink(
  join(fontDir, 'music'),
  join(drawerFontDir, 'music'),
  'static/font/music → src/drawer/font/music'
)

createSymlink(
  join(fontDir, 'text'),
  join(drawerFontDir, 'text'),
  'static/font/text → src/drawer/font/text'
)

// Create js/unilang symlink
createSymlink(
  join(staticDir, 'js/unilang'),
  srcDir,
  'static/js/unilang → src'
)

console.log('\n✓ All symlinks created successfully!')
