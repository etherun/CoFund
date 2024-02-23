const FundraiserFactoryContract = artifacts.require("FundraiserFactory");

contract("FundraiserFactory: deployment", () => {
  beforeEach(async () => {
    fundraiserFactory = await FundraiserFactoryContract.new();
  });

  it("has been deployed", async () => {
    assert(fundraiserFactory, "fundraiser factory was not deployed");
  });
});

contract("FundraiserFactory: createFundraiser", (accounts) => {
  beforeEach(async () => {
    fundraiserFactory = await FundraiserFactoryContract.new();
  });

  let fundraiserFactory;
  // fundraiser args
  const name = "Beneficiary Name";
  const url = "beneficiaryname.org";
  const imageURL = "https://placekitten.com/600/350";
  const bio = "Beneficiary Description";
  const beneficiary = accounts[1];
  it("increments the fundraisersCount", async () => {
    const currentFundraisersCount = await fundraiserFactory.fundraisersCount();
    await fundraiserFactory.createFundraiser(
      name,
      url,
      imageURL,
      bio,
      beneficiary
    );
    const newFundraisersCount = await fundraiserFactory.fundraisersCount();
    assert.equal(
      currentFundraisersCount.toNumber(),
      newFundraisersCount.toNumber() - 1,
      "Fundraiser count should match"
    );
  });
});

contract("FundraiserFactory: fundraisers", (accounts) => {
  async function createFundraiserFactory(fundraiserCount, accounts) {
    const factory = await FundraiserFactoryContract.new();
    await addFundraisers(factory, fundraiserCount, accounts);
    return factory;
  }
  async function addFundraisers(factory, count, accounts) {
    const name = "Beneficiary";
    const lowerCaseName = name.toLowerCase();
    const beneficiary = accounts[1];
    for (let i = 0; i < count; i++) {
      await factory.createFundraiser(
        `${name} ${i}`,
        `${lowerCaseName}${i}.com`,
        `${lowerCaseName}${i}.png`,
        `Description for ${name} ${i}`,
        beneficiary
      );
    }
  }
  describe("when fundraisers collection is empty", () => {
    it("returns an empty collection", async () => {
      const factory = await createFundraiserFactory(0, accounts);
      const fundraisers = await factory.fundraisers(10, 0);
      assert.equal(fundraisers.length, 0, "collection should be empty");
    });
  });

  describe("varying limits", async () => {
    let factory;
    beforeEach(async () => {
      factory = await createFundraiserFactory(30, accounts);
    });
    it("returns 10 results when limit requested is 10", async () => {
      const fundraisers = await factory.fundraisers(10, 0);
      assert.equal(fundraisers.length, 10, "results size should be 10");
    });
    it("returns 20 results when limit requested is 20", async () => {
      const fundraisers = await factory.fundraisers(20, 0);
      assert.equal(fundraisers.length, 20, "results size should be 20");
    });
    it("returns 20 results when limit requested is 30", async () => {
      const fundraisers = await factory.fundraisers(30, 0);
      assert.equal(fundraisers.length, 20, "results size should be 20");
    });
  });
});
