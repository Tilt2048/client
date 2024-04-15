# 🤪Tilt&Tilt 2048

<p align=center>
<img src="https://github.com/Tilt2048/client/assets/115441816/1367028f-4790-475c-af21-8ecac09def3a"  />
</p>
<p align=center>
  Tilt&Tilt 2048은 기존에 화면을 스와이프 하여 진행하던 방식이 아닌 기기를 기울여 가며 진행하는 새로운 방식의 2048 게임 입니다.
</p>

# 📑 목차
- [Preview](#-preview)
- [동기](#-동기)
- [게임 구현 흐름](#-게임-구현-흐름)
- [기술 스택](#-기술-스택)
  - [React Native Cli vs Expo Cli](#-react-native-cli-vs-expo-cli)
- [Challenge](#-challenge)
  - [사용자 기기 기울기 설정](#사용자-기기-기울기-설정)
  - [기울기 감지 임계값](#기울기-감지-임계값)
  - [타일들의 자연스러움 움직임](#타일들의-자연스러운-움직임)
  - [게임 저장 시점](#게임-저장-시점)

# 🎬 Preview
|게임 진행|성공|
|---|---|
|<img src="https://github.com/Tilt2048/client/assets/115441816/484123c8-82ae-41e8-80bb-ae6d8411286c" width="300" height="650"/>|<img src="https://github.com/Tilt2048/client/assets/115441816/4224d23b-3197-4348-8aef-414bc6da45e3" width="300" height="650"/>|

# 🤔 동기
- 예전부터 자주 즐겨하던 2048게임을 다른 방식으로 진행한다면 어떨까 재밌지 않을까라는 생각에 기기의 기울기를 활용한 2048게임을 제작하게 되었습니다. 프로젝트를 진행하면서 기기의 여러가지 센서를 활용하여 또 다른 게임 진행방식을 적용해보는 것도 재미있을 것 같다는 생각을 하였습니다.

# 🌊 게임 구현 흐름
<img width="918" alt="스크린샷 2024-03-10 오후 3 40 19" src="https://github.com/Tilt2048/client/assets/115441816/33e501e3-77ab-47a6-a05d-9814b7668d79"> 

- 새로운 타일을 생성하기

함수명: getUndefinedCells(board)

목적: 게임 보드를 순회하며 비어 있는(즉, 타일이 할당되지 않은) 셀들의 위치를 배열로 수집합니다.

작동 원리:
board 배열의 각 행(row)과 열(cell)을 순회합니다.

셀이 비어있는 경우(cell이 undefined 또는 null), 해당 셀의 행과 열 인덱스를 객체로 만들어 undefinedCells 배열에 추가합니다.

최종적으로 수집된 비어 있는 셀들의 위치 배열을 반환합니다.
</br>

함수명: createRandomTile(board)

목적: 비어 있는 셀 중 무작위로 하나를 선택하여 새 타일을 생성하고 게임 보드에 추가합니다.

작동 원리:
getUndefinedCells 함수를 사용하여 비어 있는 셀의 위치를 가져옵니다.

비어 있는 셀 위치 중 랜덤한 위치를 선택합니다 (Math.random() 함수 사용).

새 타일의 값으로 2 또는 4를 랜덤하게 결정합니다.

선택된 위치에 새 타일 객체를 생성하고, id 속성에 현재 시각(Date.now())을 사용하여 고유성을 부여합니다.

새로 생성된 타일을 게임 보드에 추가한 후, 수정된 보드를 반환합니다.

</br>

- 타일 움직이기
함수명: moveTiles

목적: 기기가 기울어지는 방향에 맞게 타일들을 이동시킵니다.

작동 원리:

rotateMatrix: 'up'과 'down' 방향을 처리하기 위한 전처리 단계로, 보드를 90도 회전시켜 수평 이동 로직을 재사용할 수 있게 합니다.

createRandomTile: 동일한 값을 가진 인접 타일을 합치고, 정의되지 않은 셀을 걸러냅니다.

arrangeBoard: 타일이 정확한 위치에 배치되도록 보장하며, 모든 타일의 위치 정보를 업데이트합니다.


# 🛠️ 기술 스택
<img src="https://img.shields.io/badge/javascript-F7DF1E?style=flat-square&logo=javascript&logoColor=white"> <img src="https://img.shields.io/badge/react-61DAFB?style=flat-square&logo=react&logoColor=white">
</br>
<img src="https://img.shields.io/badge/expo-000020?style=flat-square&logo=expo&logoColor=white">
</br>
<img src="https://img.shields.io/badge/nodedotjs-339933?style=flat-square&logo=nodedotjs&logoColor=white"> <img src="https://img.shields.io/badge/express-000000?style=flat-square&logo=express&logoColor=white"> <img src="https://img.shields.io/badge/mongodb-47A248?style=flat-square&logo=mongodb&logoColor=white"> <img src="https://img.shields.io/badge/mongoose-880000?style=flat-square&logo=mongoose&logoColor=white">
</br>
<img src="https://img.shields.io/badge/jest-C21325?style=flat-square&logo=jest&logoColor=white">

## 🔥 React Native Cli vs Expo Cli
|               | React Native                                                                                           | Expo                                                                                                                                                                                                                                               |
|---------------|--------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **장점**      | - iOS와 Android의 네이티브 API와 직접적으로 상호작용이 가능<br>- 네이티브 코드(Java, Kotlin, Objective-C, Swift 등)를 직접 작성하여 사용 가능<br>- 넓은 커뮤니티 및 생태계        | - 초기 설정이 간단하고, 몇 분 내로 새 프로젝트를 시작 가능<br>- Expo 앱은 자체 서버를 통해 JavaScript 코드를 업데이트할 수 있으며, 사용자가 앱 스토어를 통해 앱을 업데이트할 필요가 없음<br>- 카메라, 위치, 알림 등을 포함한 다양한 네이티브 기능에 접근할 수 있는 미리 구성된 API와 컴포넌트를 제공 |
| **단점**      | - 설정과 초기 프로젝트 구성이 복잡함<br>- 플랫폼별 빌드 과정이 필요하기 때문에, 앱 스토어를 통한 업데이트 절차가 필요 | - 내장 API와 컴포넌트에만 의존하기 때문에, 이 범위를 벗어나는 네이티브 기능을 직접 구현하고자 할 때 제한적일 수 있음<br>- Expo SDK를 포함하기 때문에, 최소한의 기능만을 가진 앱이라도 파일 크기가 클 수 있음                                           |

제한된 기간내에 프로젝트를 완성해야 했으므로 초기 세팅이 간편한 expo Cli를 사용하여 프로젝트를 진행하였습니다.

## 🔥 Challenge

### 사용자 기기 기울기 설정
- 유저들이 게임을 진행함에 따라 모두 같은 기기의 기울기에 게임을 진행하지 않으므로 초기 기울기 세팅을 해야했습니다. 초기 기기의 기울기 값을 기준으로 기울기를 설정하여 기기의 초기 기울임에 상관없이 기기의 기울임의 정도에 따라 타일들을 움직여 게임을 진행하였습니다.
- expo-sensors라이브러리의 Accelerometer을 사용하여 기기의 기울임을 감지하고 기기의 초기세팅을 할 수 있었습니다.
- https://docs.expo.dev/versions/latest/sdk/accelerometer/
<img src="https://github.com/Tilt2048/client/assets/115441816/2c523394-7811-4313-a9c6-da4c799fe838" width="300" height="650"/>

### 기울기 감지 임계값
여러 각도를 테스트 해본 결과 30도정도의 기울임이 발생했을 때 기기의 기울임이 발생됐다고 판단되는 것이 가장 게임을 진행하는데에 무리가 없었습니다.
30도의 기울기에 해당하는 센서의 출력값을 계산하기 위해, 다음의 공식을 사용할 수 있습니다:
```
a=g×sin(θ)
```

여기서:
a는 가속도 센서에서 읽힐 값입니다.
g는 중력 가속도(약 9.81 m/s² 또는 센서에서는 1g로 표시됨)입니다.
θ는 라디안 단위의 각도입니다.
30도를 라디안으로 변환하면 
θ = 30 × π/180라디안입니다.

코드로 작성했을 경우:
```
// 각도를 라디안으로 변환
const degreesToRadians = (degrees) => degrees * (Math.PI / 180);

// 중력 가속도
const g = 1; // 센서가 g 단위로 출력 값을 반환한다고 가정

// 30도에 해당하는 임계값 계산
const TILT_THRESHOLD = g * Math.sin(degreesToRadians(30));
```
이렇게 기울기 임계값을 설정했을 경우 TILT_THRESHOLD는 0.4999999가 나오게 되며 이에따라 0.5로 설정해주었습니다.

### 타일들의 자연스러운 움직임
초기에 코드를 작성할 때 기기가 기울어진 방향으로 타일들을 이동하되 이동한 후의 상태를 재렌더링하는 방식으로 진행하였었습니다. 그 결과 타일들이 미끄러지듯 움직이지 않고 기존 자리에서 사라졌다가 기울인 방향에 새로 나타나는 식으로 보여 움직임이 부자연스러웠습니다.
react-native의 Animated를 사용하여 기존에 타일이 있던 곳에서 기기를 기울여 이동하게된 곳으로 미끄러지듯 자연스럽게 이동하는 애니메이션을 추가하여 자연스러운 움직임을 구현하였습니다.

```
const position = useRef(
    new Animated.ValueXY({ x: 90 * cell.positionX, y: 90 * cell.positionY }),
  ).current;

  useEffect(() => {
    Animated.timing(position, {
      toValue: {
        x: cell.positionX * 90,
        y: cell.positionY * 90,
      },
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [cell.positionX, cell.positionY]);

  useEffect(() => {
    setScaleAndOpacity(new Animated.Value(0));
  }, [cell.value]);
```
- useRef를 사용하여 position이 변경되더라도 이를 사용하는 컴포넌트가 리렌더링되지 않도록 하였습니다.
- React 컴포넌트가 리렌더링 될 때 useRef에 의해 반환된 객체는 최신의 상태를 유지하게 됩니다. current 프로퍼티는 이 애니메이션 값 객체를 직접 참조하며, 이 값은 컴포넌트의 생명주기 동안 변하지 않고 유지됩니다. 이는 애니메이션 값이 각 렌더링 사이에 초기화되지 않고, 지속적으로 업데이트될 수 있게 해줍니다.

|애니메이션 적용 전|애니메이션 적용 후|
|---|---|
|<img src="https://github.com/Tilt2048/client/assets/115441816/ade77ee6-0cba-4e85-927e-0fce93f16eb6" width="300" height="300"/>|<img src="https://github.com/Tilt2048/client/assets/115441816/086ac8a9-47b0-4985-9c68-aa035b4cf7a7" width="300" height="300"/>|

### 게임 저장 시점
유저가 로그인을 하고 게임의 진행상황을 저장할 시점에 대한 고민이 많았습니다. 매번 타일들이 움직일 때 저장을 해야할지 게임을 정지시키거나 홈으로 돌아갈 때 저장을 해야할지 고민하던 중 어플이 종료되거나 어플이 백그라운드로 전환될 때 저장하는 것이 가장 좋다고 생각이 되었습니다.
react-native가 제공하는 AppState를 활용하여 어플이 비활성화 되거나 백그라운드로 전환되었을 때를 감지하여 그 순간에 게임의 진행상황을 저장하도록 하였습니다.

### 로그인 하지 않은 유저의 게임 진행 상황 저장
react-native의 AsyncStorage를 사용하여 저장
AsyncStorage는 React Native에서 데이터를 비동기적으로 저장하고 조회하는 데 사용되는 키-값 저장 시스템입니다. 이는 로컬 스토리지와 유사하며, 앱이 오프라인일 때도 사용자의 장치에 데이터를 영구적으로 저장할 수 있습니다. AsyncStorage를 사용하면 간단한 데이터를 로컬에 저장하여 앱이 재시작되어도 데이터가 유지되도록 할 수 있습니다. 저장된 데이터는 앱을 종료하거나 장치를 재시작해도 유지됩니다. 이는 사용자의 설정, 앱 상태 등을 저장하기에 적합합니다.

### 프로젝트 소감
프로젝트를 진행하면서 유저가 앱을 사용하는 입장에서 어떻게하면 게임을 진행하는데에 있어 더 매끄럽게 진행할 수 있을까를 많이 고민했던 프로젝트였습니다. 그간 게임을 하면서 간단한 게임이더라도 별 무리없이 진행되던 게임조차도 유저의 게임 경험을 방해하지않기 위해 많은 사항들이 고려되었다는 것을 알게된 것 같습니다. 게임의 흐름뿐만 아니라 게임이 진행되는 모습, 2048같은 경우는 타일들이 부드럽게 이동하고 병합하는 것들이 굉장히 중요하다는 것을 알게되었습니다. 
