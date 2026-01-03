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

We recommend using the [Jujutsu shell completions](https://docs.jj-vcs.dev/latest/install-and-setup/#dynamic-completions)
to make working with the tool just a little easier still.

## Making changes with Jujutsu

Just start editing files like you normally would. Don't worry about creating
a branch, we'll do all that after the fact!

When you're done, enter the following command to describe your changes:

```bash
jj describe -m "The description of your change"
```

You can continue editing in the current change or you can start a new change.
To start a new change, use the following command:

```bash
jj new
```

**Note:** You can get the list of changes by running `jj` without any
arguments. Each change will have a change id and associated git metadata.

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
to update the local repository with any upstream changes:

```bash
jj git fetch
jj rebase -d <branch-name>
```

## Updating the remote branch

When you need to update a pull request with new changes, you can follow the 
same workflow as you've used to make changes. After you're done updating your
work you can update the remote branch following these steps:

1. First, move the bookmark with `jj bookmark move <branch-name>`
2. Then, push the changes with `jj git push`

And you're done!

