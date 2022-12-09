import react from 'react'
import htm from 'htm'
import { FourOhFour } from './FourOhFour.js'
import { Header } from '../Header.js'
import superagent from 'superagent'
import { AsyncPage } from './AsyncPage.js'

const html = htm.bind(react.createElement)

export class Author extends AsyncPage {
  // constructor (props) {
  //   super(props)
  //   this.state = {
  //     author: null,
  //     loading: true
  //   }
  // }

  // async loadData () {
  //   let author = null
  //   this.setState({ loading: false, author })
  //   try {
  //     // 이렇게 하면 객체 안의 body 키가 가지는 값 저장
  //     const { body } = await superagent.get(
  //       `http://localhost:3001/api/author/${
  //         this.props.match.params.authorId
  //       }`
  //     )
  //     // 여기서 author를 바꾼다고 state가 적용될까?
  //     author = body
  //   } catch (e) {
  //     this.setState({ loading: false, author })
  //   }
  // }

  // componentDidMount () {
  //   this.loadData()
  // }

  // componentDidUpdate (prevProps) {
  //   if (prevProps.match.params.authorId !==
  //     this.props.match.params.authorId) {
  //       this.loadData()
  //     }
  // }

  static async preloadAsyncData (props) {
    const { body } = await superagent.get(
      `http://localhost:3001/api/author
      /${props.match.params.authorId
    }`
    )
    return { authors: body }
  }

  render () {
    if (this.state.loading) {
      return html`<${Header}/><div>Loading ...</div>`
    }

    if (!this.state.author) {
      return html`<${FourOhFour}
      staticContext = ${this.props.staticContext}
      error = "Author not found"
      />`
    }
    if (!author) {
      return html`<${FourOhFour}
        staticContext=${this.props.staticContext}
        error="Author not found"
        />`
    }

    return html`<div>
      <${Header}/>
      <h2>${this.state.author.name}</h2>
      <p>${this.state.author.bio}</p>
      <h3>Books</h3>
      <ul>
        ${this.state.author.books.map((book) =>
          html`<li key=${book.id}>${book.title} (${book.year})</li>`
        )}
      </ul>
    </div>`
  }
}