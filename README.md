# roundy

<img src='./roundy.png' alt='Roundy'/>
Configurable react round slider. Supports touch events.

## Installation

```
npm i roundy (or yarn add roundy)
```

## Usage

You can use Roundy as a single slider:

```javascript
import Roundy from 'roundy';

const {value} = this.state
<Roundy
   value={value}
   min={10}
   max={30}
   step={5}
   radius={100}
   sliced
   color='pink'
   onChange={value => this.setState({value})}
   onAfterChange={(value, props) => ... }
   overrideStyle={ ... string template as CSS ...}
>
```

Or use roundy as a group of sliders:

```javascript
import { RoundyGroup } from 'roundy'

<RoundyGroup sliders={[
    { value: 30, step: 10, id: 'mjaw', max: 50,  radius: 60, color: 'blueviolet', onChange:(val, props) => console.log(props) },
    { value: 30, step: 10, max: 50, radius: 100 },
    { value: 100, step: 20, max: 200, color: 'orange', radius: 140, sliced: false, step: 1 }
]} />
```

## API

Roundy provides the following API:
| Prop | Description | Default |
| ------------- |-------------| -----|
| value | number: Slider value | 50 |
| min | number: Minimal value | 0 |
| max | number: Maximum value | 100 |
| step | number: Step value to snap value | 10 |
| radius | number: Slider radius | 100 |
| color | string: Active slider color | 'purple' |
| bgColor | string: Slider arc color | '#ccc' |
| strokeWidth | number: Slider arc width | 15 |
| sliced | boolean: Provide slices based on step value | true |
| onChange | function: immediate callback function (value, props) | null |
| onAfterChange | function: callback function after release (value, props) | null |
| overrideStyle | string: provide additional class style which will be injected into styled-components class | null |

## Testing
TODO

## Contribution
Always happy to take PRs.