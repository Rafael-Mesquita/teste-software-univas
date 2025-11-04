import { describe, it, expect } from 'vitest'
import { normalizeName } from '../../src/utils/normalize'

describe('normalizeName', () => {
  
  it('remove espaços no início e no fim', () => {
    expect(normalizeName('   Ana Clara  ')).toBe('ana clara')
  })

  it('converte todas as letras para minúsculas', () => {
    expect(normalizeName('MARIA DA SILVA')).toBe('maria da silva')
  })
  
  })