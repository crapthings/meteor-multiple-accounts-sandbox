import {
  mount as _mount,
  withOptions as withMountOptions,
} from '@lvfang/react-mounter'

export const mount = withMountOptions({
  rootId: 'root',
}, _mount)

const defaultLocalState = {
  timestamp: Date.now(),
}

export const LocalState = new ReactiveDict(defaultLocalState)
