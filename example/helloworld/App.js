import { h } from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './Foo.js'
window.self = null
export const App = {
    // .vue
    // <template>
    //render
    render() {
        window.self = this
        return h("div", {
            id: 'root',
            class: ['red', 'head'],
            onClick() {
                console.log('click')
            }
        }, 
        [h('div', {}, 'hi ' + this.msg.value), h(Foo, {
            count:1
        })]
        )
    },
    setup() {
        return {
            msg: 10
        }
    }
}