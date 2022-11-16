/* 팩토리 패턴
객체의 생성과 구현을 나누는 방법. 객체를 코드에서 바로 생성하는 것이 아니라 객체를 구현하는 함수를 따로 둔다.
이와 같이 했을 때 코드를 수정할 수 있또록 유연성을 제공할 수 있고
클래스를 캡슐화 하여 private 변수처럼 쓸 수 있다. */

// ex1
function createImage(name) {
    return new Image(name)
}

const image = createImage('photo.jpeg')
// const image = new Image(name) 이렇게 바로 객체를 생성해도 되지만.. 만약 이미지 형식마다 다른 클래스 객체를 제공하고자 한다면?
// 아래와 같이 팩토리를 확장할 수 있다. 유연성있게 변화에 대처할 수 있다.
function createImageEdited(name) {
    if (name.match(/\.jpe?g$/)) {
        return new ImageJpeg(name)
    } else if (name.match(/\.png$/)) {
        return new ImagePng(name)
    } else {
        throw new Error('Unsupported format')
    }
}

// ex2
// 클로저를 통해 캡슐화 가능. 외부 코드가 컴포넌트 내부에 접근하여 조작하는 것을 방지
function createPerson(name) {
    const privateProperties = {}

    const person = {
        // ES6에서 method function 표기 생략 가능
        setName(name) {
            if (!name) {
                throw new Error('A person must have a name')
            }
            privateProperties.name = name
        },
        getName() {
            return privateProperties.name
        }
    }

    person.setName(name)
    return person
}

// ex3
// profiler.js