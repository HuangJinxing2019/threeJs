import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig(() => {
    const root = process.cwd();
    return {
        resolve: {
            alias: [
                {find: /@\//, replacement: resolve(__dirname, 'src') + '/'}
            ]
        },
        plugins: [
            vue(),
            viteMockServe({
              mockPath: 'mock',
              localEnabled: true,
            })
        ],
    }
})
