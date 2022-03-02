import { h } from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './Foo.js'

export const App = {
    name: "App",
    render() {
        return h("div", {}, [h("div", {}, "App"), h(Foo, {
            onChangeChange(a, b) {
                console.log('onChangeChange', a, b)
            }
        })])
    },
    setup() {
        return {}
    }
}