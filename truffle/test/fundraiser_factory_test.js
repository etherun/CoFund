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
