import type { StyleContent } from './types'

export const mockStyleContent: StyleContent = {
  home: {
    header: {
      backgroundColor: '#1E1E2E',
      opacity: 1,
      borderBottomWidth: 1,
      borderBottomColor: '#33334d',
    },
    title: {
      color: '#FFFFFF',
      fontSize: 22,
      fontWeight: '700',
      textAlign: 'center',
    },
    footer: {
      backgroundColor: '#F5F5F7',
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 16,
    },
  },
  add_more: {
    header: {
      backgroundColor: '#00C48C',
      opacity: 0.95,
    },
    body: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 20,
    },
  },
}
