import Http from "Http"
import { loadDataTask } from "./model"
import { Banner } from "components"

const FollowComponent = () => {
  return {
    view: ({
      attrs: {
        mdl,
        data: { username, image, createdAt },
      },
    }) => {
      return m("div.article-meta", [
        m(
          m.route.Link,
          { href: `profile/${username}` },
          m("img", { src: image })
        ),
        m("div.info", [
          m(
            m.route.Link,
            { class: "author", href: `profile/${username}` },
            username
          ),
          m("span.date", createdAt),
        ]),
        m("button.btn.btn-sm.btn-outline-secondary", [
          m("i.ion-plus-round"),
          " ",
          m.trust("&nbsp;"),
          ` Follow ${username} `,
          m("span.counter", "(10)"),
        ]),
        " ",
        m.trust("&nbsp;"),
        m.trust("&nbsp;"),
        " ",
        m("button.btn.btn-sm.btn-outline-primary", [
          m("i.ion-heart"),
          " ",
          m.trust("&nbsp;"),
          " Favorite Post ",
          m("span.counter", "(29)"),
        ]),
      ])
    },
  }
}

const CommentForm = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m("form.card.comment-form", [
        m(
          "div.card-block",
          m("textarea.form-control[placeholder='Write a comment...'][rows='3']")
        ),
        m("div.card-footer", [
          m("img.comment-author-img[src='http://i.imgur.com/Qr71crq.jpg']"),
          m("button.btn.btn-sm.btn-primary", " Post Comment "),
        ]),
      ]),
  }
}

const Comment = () => {
  return {
    view: ({
      attrs: {
        mdl,
        comment: {
          author: { image, username },
          body,
          createdAt,
          id,
        },
      },
    }) =>
      m("div.card", [
        m("div.card-block", m("p.card-text", body)),
        m("div.card-footer", [
          m(
            m.route.Link,
            { class: "comment-author" },
            m("img.comment-author-img", { src: image })
          ),
          " ",
          m.trust("&nbsp;"),
          " ",
          m(m.route.Link, { class: "comment-author" }, username),
          m("span.date-posted", createdAt),
        ]),
      ]),
  }
}

const ArticleComments = () => {
  return {
    view: ({ attrs: { mdl, comments } }) => {
      return [
        m(CommentForm, { mdl }),
        comments.map((c) => m(Comment, { mdl, comment: c })),
      ]
    },
  }
}

const Article = () => {
  const data = {}
  const state = {
    status: "loading",
    error: null,
  }

  const onSuccess = ({ article, comments }) => {
    data.article = article
    data.comments = comments
    console.log("data", data)
    state.status = "success"
  }

  const onError = (error) => {
    console.log("error", error)
    state.error = error
    state.status = "error"
  }

  const loadData = (mdl) => {
    state.status = "loading"
    loadDataTask(Http)(mdl)(mdl.slug).fork(onError, onSuccess)
  }

  return {
    oninit: ({ attrs: { mdl } }) => loadData(mdl),
    view: ({ attrs: { mdl } }) =>
      m("div.article-page", [
        state.status == "loading" &&
          m(Banner, [m("h1.logo-font", "Loading ...")]),
        state.status == "error" &&
          m(Banner, [m("h1.logo-font", `Error Loading Data: ${state.error}`)]),
        state.status == "success" && [
          m(
            "div.banner",
            m("div.container", [
              m("h1", data.article.title),
              m(FollowComponent, { mdl, data: data.article.author }),
            ])
          ),
          m("div.container.page", [
            m("div.row.article-content", m("div.col-md-12", data.article.body)),
            m("hr"),
            m(
              "div.article-actions",
              m(FollowComponent, { mdl, data: data.article.author })
            ),
            m(
              "div.row",
              m(
                "div.col-xs-12.col-md-8.offset-md-2",
                m(ArticleComments, { mdl, comments: data.comments })
              )
            ),
          ]),
        ],
      ]),
  }
}

export default Article