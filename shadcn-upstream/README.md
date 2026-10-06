# shadcn-svelte upstream snapshot

The unmodified output of the shadcn-svelte CLI for every component under
`src/lib/components/ui`, as of the last run of `npm run update-components`.
Nothing imports these files. They are the merge base that lets the site keep
its own edits to the components: the update script generates the new upstream
version, three-way merges it against this snapshot and the edited component,
and then replaces the snapshot. Edit the components under `src/lib`, never
these files.
