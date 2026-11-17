import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const posts: string[] = JSON.parse(
  fs.readFileSync(new URL('../docs/competition-posts.json', import.meta.url), 'utf8'),
);
test('three original post drafts fit X standard limit including tags and spaces', () => {
  assert.equal(posts.length, 3);
  assert.equal(new Set(posts).size, 3);
  for (const post of posts) {
    assert.ok(/^[\x20-\x7E]+$/.test(post), 'ASCII makes character count unambiguous');
    assert.ok(post.length <= 280);
    assert.ok(post.includes('@meteora_my'));
    assert.ok(post.includes('#MeteoraMYContest'));
  }
  assert.deepEqual(
    posts.map((p) => p.length),
    [234, 232, 240],
  );
});
