> - 원문 : Douglas Crockford - <a target='_blank' href='http://www.crockford.com/javascript/private.html'>Private Members in JavaScript</a> 
> - 번역 : 오명운 -  hanmomhanda@gmail.com

# JavaScript에서 private 멤버를 사용하는 방법

자바스크립트는 세상에서 가장 많은 오해를 받는 프로그래밍 언어다. 어떤 사람들은 자바스크립트의 객체가 private인 인스턴스 변수나 메서드를 가질 수 없으므로, 자바스크립트는 정보 은닉이 결여되어 있는 언어라고 믿지만, 이 역시도 오해다. 자바스크립트도 private 멤버를 가질 수 있다.

## 객체

자바스크립트 객체를 바탕으로 한다. 배열도 객체고, 함수도 객체이며, 객체도 당연히 객체다. 그렇다면 도대체 객체란 무엇인가? 객체는 이름-값 쌍의 모음이다. 이름은 `string`으로 되어 있고, 값은 `string`, `number`, `boolean`, `object`(배열과 함수도 포함된다)로 구성된다. 객체는 일반적으로 해쉬테이블로 구현되어 있어서 원하는 값을 빨리 찾을 수 있다.

객체에 포함된 이름-값에서 값이 함수인 경우, 이 함수를 메서드라고 부를 수 있다. 객체 내의 메서드가 호출되면, `this` 변수가 그 객체를 가리키게 된다. 메서드는 `this` 변수를 통해 인스턴스 변수들에 접근할 수 있다.

객체는 생성자 함수에 의해 만들어진다. 생성자 함수는 객체를 초기화한다. 정적 변수나 메서드 등 다른 언어에서는 class가 제공하는 기능을 자바스크립트에서는 생성자 함수가 제공한다.

## Public

객체의 멤버(변수와 메서드)는 모두 public 이다. 어떤 함수든지 이 멤버에 접근할 수 있고, 수정할 수 있고, 삭제할 수 있으며, 새로운 멤버를 추가할 수도 있다. 새로 만들 객체에 멤버를 추가하는 방법은 두 가지가 있다.

### 생성자 함수를 이용하는 방법

이 방법은 public 인스턴스 변수를 초기화하는데 주로 사용된다. 생성자 함수의 `this`는 생성자 함수가 생성할 객체의 멤버를 추가하는데 사용된다:

```javascript
function Container(param) {
    this.member = param;
}
```
이제 새 객체를 생성해보자.

```javascript
var myContainer = new Container('abc');
```
이제 `myContainer.member`의 값은 'abc'다.


### 프로토타입 객체를 이용하는 방법 

이 방법은 public 메서드를 추가하는데 주로 사용된다. 객체 안에서 멤버를 찾는데 그 객체 안에서 찾아지지 않으면, 그 객체의 생성자 함수의 `prototype` 멤버가 가리키는 객체에서 그 멤버를 찾는다. 이런 프로토타입 메커니즘은 상속에 사용된다. 프로토타입 메커니즘은 메모리 사용량을 줄일 수 있다(역자 주: 새로 객체를 생성할 때마다 메서드도 함께 생성하는 것이 아니라, 프로토타입 객체에서 한 번만 정의하면  상속받는 객체에서 메서드를 사용할 수 있으므로 메모리를 절약할 수 있다). 어떤 생성자 함수에 의해 생성되는 모든 객체에 메서드를 추가하려면, 그 생성자 함수의 `prototype` 멤버가 가리키는 객체에 함수를 추가하면 된다.

```javascript
Container.prototype.stamp = function(string) {
    return this.member + string;
}
```
이제 아래와 같이 `stamp` 메서드를 호출할 수 있다.
```javascript
myContainer.stamp('def');
```
'abcdef'가 출력된다.

## Private

private 멤버는 생성자 함수에서 만들 수 있다. `var`를 써서 선언한 변수와 함수에 넘어온 파라미터는 private이 된다.

```javascript
function Container(param) {
    this.member = param;
    var secret = 3;
    var that = this;
}
```

이 생성자 함수는 `param`, `secret`, `that` 이렇게 세 개의 private 인스턴스 변수를 만들어낸다. 이 세 개의 인스턴스 변수는 객체에 추가되지만, 객체 바깥에서는 이 private 인스턴스 변수에 접근할 수 없고, 객체 내에 포함되어 있는 public 메서드 조차도 이 private 인스턴스 변수에 접근할 수 없다. 이 private 인스턴스 변수는 오직 private 메서드만 접근할 수 있다. private 메서드란 생성자 함수 안에 포함되는 inner 함수를 말한다.

```javascript
function Container(param) {

    function dec() {
        if (secret > 0) {
            secret -= 1;
            return true;
        } else {
            return false;
        }
    }

    this.member = param;
    var secret = 3;
    var that = this;
}
```
private 메서드 `dec`는 private 변수인  `secret`의 값을 검사한다. `secret` 값이 0보다 크면 `secret` 값을 1만큼 감소 시키고 `true`를 반환한다. 0보다 작거나 같으면 `false`를 반환한다. `dec` 메서드는 `Container` 생성자 함수를 통해 생성되는 객체를 3개로 제한한다.

private `that` 변수를 만들었는데, 이는 관례에 따른 것이다. private 메서드는 `that`을 통해서 객체에 접근할 수 있다. 이것은 inner 함수에 대해 `this`가 올바르지 않게 설정되는 ECMAScript 언어 스펙의 오류를 우회하는 방법이다.

public 메서드는 private 메서드를 호출할 수 없다. private 메서드가 public 메서드에 의해 호출될 수 있으려면 privileged 메서드가 필요하다.

## Privileged

privileged 메서드는 private 변수나 private 메서드에 접근할 수 있고, public 메서드나 이 객체 외부에서 이 privileged 메서드에 접근할 수 있다. privileged 메서드를 삭제하거나 다른 것으로 대체할 수는 있지만, privileged 메서드 내부를 변경하는 것은 불가능하다.

privileged 메서드는 생성자 함수 안에서 `this`의 멤버로 할당된다.

```javascript
function Container(param) {

    function dec() {
        if (secret > 0) {
            secret -= 1;
            return true;
        } else {
            return false;
        }
    }

    this.member = param;
    var secret = 3;
    var that = this;

    this.service = function () {
        return dec() ? that.member : null;
    };
}
``` 
`service`는 privileged 메서드다. `myContainer.service()`를 호출하면 처음 세 번 호출할 때까지는 'abc'가 반환된다. 네 번째 호출하면 `null` 이 반환된다. `service` 메서드가 private 변수인 `secret`에 접근할 수 있는 `dec` 메서드를 호출하기 때문이다. `service` 메서드는 다른 객체나 메서드에서도 호출할 수 있지만, `service` 메서드가 private 멤버 변수에 직접 접근하는 것은 불가능하다.

## Closure

앞에서 설명한 것처럼 public, private, privileged 방식을 사용할 수 있는 이유는 자바스크립트가 클로져 기능이 존재하기 때문이다. 클로져 덕분에 어떤 함수 A의 내부에 있는 함수 B는 함수 A의 파라미터나, 함수 A에서 `var`로 선언된 private 변수에 언제나 접근할 수 있으며, 심지어 함수 A의 실행이 끝나서 반환되어버린 이후에도 함수 A의 파라미터나 `var`로 선언된 private 변수에 접근할 수 있다. 클로져는 아주 막강한 특징이다. 하지만 현재(역자주: 아마도 2001년 현재) 시중에 나와 있는 자바스크립트 책 중에서 이 클로져 기능을 제대로 이용하는 방법을 보여주는 책은 없다. 대부분의 책에는 아예 언급조차 되어있지 않다.

private이나 privileged 멤버는 오직 객체가 생성될 때만 만들 수 있다. 반면에 pubilc 멤버는 아무때나 객체에 추가할 수 있다.

## Pattern

### Public

```javascript
function Constructor(...) {
    this.membername = value;
}
Constructor.prototype.membername = value;
```

### Private

```javascript
function Constructor(...) {
    var that = this;
    var membername = value;

    function membername(...) {...}

}
```

Note: `function membername(...) {...}`은 `var membername = function membername(...) {...};`를 축약한 표현이다.

### Privileged

```javascript
function Constructor(...) {
    this.membername = function (...) {...};
}
```
 
Copyright 2001 Douglas Crockford. All Rights Reserved Wrrrldwide.
