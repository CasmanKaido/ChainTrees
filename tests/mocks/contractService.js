export const contractServiceMock = {
    getUserTrees: vi.fn().mockResolvedValue([
        { id: 1, species: 0, growthStage: 1 }
    ]),
    mintTree: vi.fn().mockResolvedValue({ status: 1 }),
    waterTree: vi.fn().mockResolvedValue({ status: 1 }),
    getAchievements: vi.fn().mockResolvedValue([]),
};
