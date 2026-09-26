---
name: commit-push-pr
description: 作業中の変更からブランチ作成・コミット・push・PR作成までを行い、ユーザーがマージして「完了」と伝えたら main に戻してローカルを片付ける。
disable-model-invocation: true
effort: low
---

# commit-push-pr

変更をコミットして PR を作成し、マージ後に後片付けをする。

ブランチ名・コミットメッセージ・PRのタイトルと本文・ラベルの書き方は `.claude/rules/git-workflow.md` に従う。このRepositoryのマージ済みPRはActivityとしてサイトに公開されるため、タイトルと本文の最初の段落は閲覧者向けに書く。

## フェーズ1：PR を作成する

### 1. 現状確認

```bash
git status
git branch --show-current
git diff --stat
git diff
```

- 変更がなければ、その旨を伝えて終了する
- 現在のブランチが `bot/activity` の場合は中止する（Activity更新用の予約ブランチ）

### 2. 公開してよい内容か確認

差分に次のものが含まれていないか確認し、含まれていればコミットせずユーザーに伝える。

- `.env`・トークン・APIキーなどの秘密情報
- 個人情報・顧客名・案件名・所属企業名（`.claude/rules/content-authoring.md` 「公開してよい情報」）
- `.users/` や `content/_drafts/` のファイル（`.gitignore` 対象。強制追加しない）

### 3. ブランチを決める

- **main にいる場合**：差分から type と内容を判断してブランチ名を決め、作成する（形式は `git-workflow.md`）

  ```bash
  git switch -c <type>/<短い説明>
  ```

- **作業ブランチにいる場合**：そのブランチを使う

差分に無関係な変更が混ざっている場合（例：機能追加と別件の修正）は、PRを分けるかユーザーに確認する。

### 4. コミット

```bash
git add <対象ファイル>
git commit -m "<type>(<scope>): <内容>"
```

- `git add -A` / `git add .` を使わず、対象ファイルを指定する

### 5. push

```bash
git push -u origin <branch-name>
```

### 6. PR 作成

```bash
gh pr create --base main --head <branch-name> --title "<title>" --body "<body>"
```

- タイトル：`<type>(<scope>): <閲覧者が読んで分かる日本語>`（Activityの見出しになる）
- 本文：最初の段落に「何を変えて、閲覧者にとって何が良くなったか」を1〜2文。実装の詳細は見出し以降に書く
- ラベル：Activityとして載せない変更（type が feat / fix 等でも）には `activity:skip`、作品のTechと異なるTechを示したい場合は `tech:<id>` を `--label` で付ける。付けるかどうか迷う場合はユーザーに確認する

### 7. ユーザーに伝える

- PR の URL
- Activityとして公開される見出しと要約（タイトルの `: ` 以降と本文の最初の段落）
- 「マージしたら『完了』と伝えてください」

## フェーズ2：マージ後の後片付け（ユーザーが「完了」と伝えたとき）

### 1. マージを確認する

```bash
gh pr view <branch-name> --json number,state,mergedAt,url
```

- `state` が `MERGED` でなければ、その旨を伝えて何もしない

### 2. main に戻して片付ける

```bash
git switch main
git pull --ff-only
git branch -D <branch-name>
git fetch --prune
```

- squash マージでは作業ブランチのコミットが main に含まれないため、`git branch -d` は失敗する。手順1でマージ済みを確認したうえで `-D` で削除する
- リモートの作業ブランチが残っている場合は削除する（GitHub の「Automatically delete head branches」が有効なら不要）

  ```bash
  git push origin --delete <branch-name>
  ```

### 3. 結果を伝える

main が最新になったこと、削除したブランチ名を伝える。

## 注意

- main へ直接 push しない
- `--force` / `--no-verify` を使わない
- `gh` にログインしていない場合は、`! gh auth login` の実行をユーザーに依頼する
