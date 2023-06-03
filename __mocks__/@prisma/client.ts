export const PrismaClient = jest.fn().mockImplementation(() => {
  return {
    user: {
      findUnique: jest.fn().mockResolvedValue({
        id: '1',
      })
    }
  }
})