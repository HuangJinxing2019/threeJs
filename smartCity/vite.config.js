import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from  'path'

export default defineConfig(() => {
  const root = process.cwd();
  return {
    resolve: {
      alias: [
        {find: /@\//, replacement: resolve(__dirname, 'src') + '/'}
      ]
    },
    plugins: [vue()],
  }
})
