> - 원문 : Martin Fowler - <a href='http://martinfowler.com/bliki/ListAndHash.html' target='_blank'>ListAndHash</a>
> - 번역 : 오명운(hanmomhanda@gmail.com)
> - 한줄요약 : ListAndHash라는 자료구조를 만들자.

# ListAndHash(리스트이자 해쉬인 자료 구조)

리스트와 해쉬맵의 조합으로 자료 구조(data structure)를 표현하는 방식은 이제 여러 다양한 프로그래밍 환경에서 일반적으로 사용되고 있습니다. 가장 널리 쓰이는 주요 언어들은 이런 자료 구조를 언어 자체의 표준으로 제공하고 있으며, 여기에는 컬렉션 파이프라인(<a href='http://martinfowler.com/articles/collection-pipeline/' target='_blank'>Collection Pipelines</a>)처럼 해당 자료 구조를 여러가지 방식으로 다룰 수 있게 해주는 다양한 함수들도 포함됩니다. 이런 자료 구조들<sup>[1](#1)</sup>은 대단히 유연해서 위계(hierarchy) 개념을 내포하고 있는 대부분의 데이터를 쉽게 처리하고 조작할 수 있게 해줍니다.

![](http://martinfowler.com/bliki/images/listAndHash/listAndHash-01.png)

이런 자료 구조의 핵심은 (대부분) 두 가지의 자료 구조로 이루어져 있습니다.

- **해쉬맵**은 키-값 자료 구조로서, 연관 배열(associative arrays), 해쉬테이블(hashtables), 맵(maps) 또는 사전(dictionaries)이라고 불리기도 합니다.
- **리스트**는 단순한 나열입니다. 리스트는 원소를 추가하거나 삭제할 때 동적으로 크기가 변한다는 점에서 전통적인 배열과 차이가 있습니다(리스트를 배열이라고 부르는 언어도 있기는 합니다). 리스트는 정수키로 인덱싱 됩니다.

트리 구조에서의 말단 노드(leaf)는 보통 해당 언어의 기본형 데이터(primitive data)로 구성되지만, 리스트나 해쉬같은 방식으로 처리되지 않는 다른 자료 구조로 구성될 수도 있습니다.

대부분의 경우, 리스트와 해쉬는 접근하는 방식이 다르기 때문에 명확하게 분리된 데이터 타입으로 존재합니다. 그러나, LISP 언어 사용자들이 얘기하는 것처럼, 해쉬는 키-값 쌍의 연속이므로 리스트로 쉽게 표현할 수 있습니다. 비슷한 방식으로, 숫자로 된 키를 가지고 있는 해쉬는 리스트처럼 다룰 수도 있습니다(Lua의 테이블이 이런 방식입니다).

**리스트이자 해쉬인 자료 구조(list 'n' hash structure)**는 기본적으로 스키마가 없습니다. 리스트는 그저 중복되지 않는 원소들로 구성되어 있고, 해쉬도 중복되지 않는 키의 조합으로 이루어져 있습니다. 스키마가 없다는 것은 자료 구조를 아주 유연하게 해주지만, 사실 우리는 실제로는 어떤 데이터가 어떤 키로 표현되기를 기대하고 있다는 점에서, 스키마 없는 자료 구조를 다룬다고 할지라도 <a href='http://martinfowler.com/articles/schemaless/#implicit-schema' target='_blank'>거의 예외 없이 내부적인 스키마가 있다</a>는 사실을 잊어서는 안됩니다. 

리스트이자 해쉬인 자료 구조의 장점 중의 하나는, 실제 키가 존재하는지 여부를 모르더라도 쓸 수 있는 제네릭 함수(generic operations)를 써서 데이터를 다룰 수 있다는 점입니다. 이런 제네릭 함수는 처리하고자 하는 데이터에 대한 특정 키를 파라미터로 받을 수도 있습니다. 보통 컬렉션 파이프라인(<a target='_blank' href='http://martinfowler.com/articles/collection-pipeline/'>Collection Pipelines</a>)으로 정리될 수 있는 이런 제네릭 함수는, 자료 구조 안의 개별 원소를 하나하나 거치지 않고도 필요한 원소를 콕 집어낼 수 있는 다양한 탐색 기능을 제공합니다.

유연성이 좋은 해쉬는 일반적으로 정형화 되지 않은 레코드에 사용하지만, 리플렉션(reflection) 함수를 제공한다는 전제 조건이 성립한다면, 정형화 된 레코드에서도 정형화 되지 않은 레코드에서와 마찬가지 방법으로 해쉬를 사용할 수 있습니다. 정형화된 레코드 구조는 아무거나 담을 수 없다는 제약이 있기는 하지만(어쩌면 이런 제약은 필요한 것이기도 합니다), 제네릭 함수를 사용하면 정형화된 레코드도 쉽게 다룰 수 있습니다. 하지만 이렇게 되려면 정형화 된 레코드가 마치 해쉬인 것처럼 쿼리할 수 있는 메커니즘이 언어 환경 수준에서 제공되어야 합니다.

리스트이자 해쉬인 자료 구조는 쉽게 직렬화(serialized) 될 수 있으며, 보통 텍스트 형태로 직렬화 됩니다. JSON은 특히 이런 자료 구조의 직렬화에 효율적이므로, 필자는 이런 용도에는 JSON을 기본으로 사용합니다. 리스트이자 해쉬인 자료 구조를 직렬화 하는데 XML을 사용하것도 쓸만한 방법이기는 하지만, XML에는 실제 데이터 외에도 많은 메타 데이터가 포함되므로 필요 이상으로 장황해지기도 하고, 이런 리스트이자 해쉬인 자료 구조에는 요소(elements)와 속성(attributes)을 구별해서 기술하는 것은 적합하지 않습니다(물론 텍스트를 마크업하는데는 요소와 속성을 구별하는 것이 유용합니다).

리스트이자 해쉬인 자료 구조가 아주 널리 사용되기는 하지만, 더 친절한 트리 구조로 표현하는 것이 더 좋겠다는 생각이 들 때가 있습니다. 트리 모델은 더 풍부한 탐색 함수를 제공할 수 있습니다. 직렬화 된 XML 구조를 <a target='_blank' href='http://www.rubydoc.info/github/sparklemotion/nokogiri'>Nokogiri</a> 파서로 작업하고 탐색할 때 XPath나 CSS selector를 사용하면 아주 편리합니다.  XPath나 CSS selector 같은 종류의 일반적인 경로 명세(path specification) 방식은 대규모 문서에서 더 빛을 발할 수 있습니다. 리스트이자 해쉬인 자료 구조를 사용할 때 발생할 수 있는 이슈 중의 하나는, 어떤 특정 노드의 부모나 조상을 찾기가 매우 불편하다는 점 입니다. 현대 프로그래밍 언어에서 리스트와 해쉬가 표준 장치로 제공되는 것은, 필자가 포트란 IV로 프로그래밍을 시작한 이래 이 분야의 가장 두드러진 발전 중의 하나임에 틀림없지만, 앞서 얘기한 것처럼 아직도 개선할 부분이 더 남아 있습니다.

### Acknowledgements

David Johnston, Marzieh Morovatpasand, Peter Gillard-Moss, Philip Duldig, Rebecca Parsons, Ryan Murray, and Steven Lowe discussed this post on our internal mailing list.

### Notes

<a name='1'>1</a>: 이런 자료 구조를 언어에 종속되지 않으면서 일반적으로 지칭하는 용어가 없다니.. 필자는 항상 <a target='_blank' href='http://martinfowler.com/bliki/Neologism.html'>Neologism</a>에 대한 욕망이 있는 편이라, 적절한 용어를 만들어볼까 하는 생각도 든다.
