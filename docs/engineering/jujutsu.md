# Using Jujutsu with the repository

In this repository you can use jj (Jujutsu) to work with the source control
environment. Make sure you're familiar with the tool before starting work.

Read up on the tutorial [here](https://docs.jj-vcs.dev/latest/github/).

## Why use Jujutsu

While most developers are familiar with Git it may not be the best option to
manage source repositories. Jujutsu is a new invention that is supposed to make
many annoying things about working with git easier.

### A simpler mental model

With Jujutsu you get a simpler mental model. The working copy is what you'll
commit to the repository. So whenever you edit a file it is automatically
included in the commit. Same goes for removals, or new files.

### First-class conflict handling

Conflicts no longer block operations on the repository. Instead conflicts 
are recorded in the commit so you can deal with them later if you want to.

### Powerful rewriting options

Jujutsu has powerful tools to rewrite the history of the changes you made.
This makes it much easier to create clean commit histories without having
to bend over backwards.

### Git compatible

We didn't have to break the repository to make Jujutsu work. It lives alongside
the original git repository history. We don't migrate anything!

## Configure Jujutsu for your machine

Make sure you have Jujutsu installed on your machine. After that, run
the following command inside the cloned github repository:

```bash
jj git init --colocate
```

## Making changes with Jujutsu

Just start editing files like you normally would. Don't worry about creating
a branch, we'll do all that after the fact!

When you're done, enter the following command to describe your changes:

```bash
jj describe -m "The description of your change"
jj new
```

The first line describes the commit. The second line starts a new change.
You can navigate between changes as you wish with `jj edit <change-identifier>`
to update them with more edits.

You can get the list of changes by running `jj` without any arguments.

## Creating a branch and pushing changes

Branches (if that is even a thing in Jujutsu) are bookmarks. You can create
a new bookmark with the following command:

```bash
jj bookmark create <bookmark-name>
```

After creating a bookmark, you can push it to git using these two commands:

```bash
jj bookmark track <bookmark-name>@origin
jj git push
```

## Updating your local repository

Jujutsu doesn't have the `git pull` command. You'll need these two commands
to update the local repository:

```bash
jj git fetch
jj rebase -o $main_bookmark
```





