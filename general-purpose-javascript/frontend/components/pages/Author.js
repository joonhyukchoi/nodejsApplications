import react from 'react'
import htm from 'htm'
import { FourOhFour } from './FourOhFour.js'
import { Header } from '../Header.js'
import { authors } from '../../../data/authors.js'

const html = htm.bind(react.createElement)

export class Author extends react.Component {
  render () {
    // find 함수는 배열의 요소를 만족하는 첫 번째 값 반환
    const author = authors.find(
        // react router를 통해서 authorId를 전달함(App.js 파일에 /: 뒷부분)
      author => author.id === this.props.match.params.authorId
    )

    if (!author) {
      return html`<${FourOhFour} error="Author not found"/>`
    }

    return html`<div>
      <${Header}/>
      <h2>${author.name}</h2>
      <p>${author.bio}</p>
      <h3>Books</h3>
      <ul>
        ${author.books.map((book) =>
          html`<li key=${book.id}>${book.title} (${book.year})</li>`
        )}
      </ul>
    </div>`
  }
}