using FakeItEasy;
using Promptyard.Api.Repositories;

namespace Promptyard.Api.Tests.Repositories;

public class RepositorySlugGeneratorTests
{
    private readonly IRepositoryLookup _repositoryLookup;
    private readonly RepositorySlugGenerator _sut;

    public RepositorySlugGeneratorTests()
    {
        _repositoryLookup = A.Fake<IRepositoryLookup>();
        _sut = new RepositorySlugGenerator(_repositoryLookup);
    }

    [Test]
    public async Task GenerateSlugWithSimpleNameReturnsLowercaseSlug()
    {
        SetupNoCollisions();

        var result = _sut.GenerateSlug("John Doe");

        await Assert.That(result).IsEqualTo("john-doe");
    }

    [Test]
    public async Task GenerateSlugWithUppercaseNameReturnsLowercaseSlug()
    {
        SetupNoCollisions();

        var result = _sut.GenerateSlug("JOHN DOE");

        await Assert.That(result).IsEqualTo("john-doe");
    }

    [Test]
    public async Task GenerateSlugWithMultipleSpacesCollapsesToSingleHyphen()
    {
        SetupNoCollisions();

        var result = _sut.GenerateSlug("John  Doe");

        await Assert.That(result).IsEqualTo("john-doe");
    }

    [Test]
    public async Task GenerateSlugWithManySpacesCollapsesToSingleHyphen()
    {
        SetupNoCollisions();

        var result = _sut.GenerateSlug("John     Doe");

        await Assert.That(result).IsEqualTo("john-doe");
    }

    [Test]
    public async Task GenerateSlugWithUnderscoreConvertsToHyphen()
    {
        SetupNoCollisions();

        var result = _sut.GenerateSlug("John_Doe");

        await Assert.That(result).IsEqualTo("john-doe");
    }

    [Test]
    public async Task GenerateSlugWithMultipleUnderscoresCollapsesToSingleHyphen()
    {
        SetupNoCollisions();

        var result = _sut.GenerateSlug("John___Doe");

        await Assert.That(result).IsEqualTo("john-doe");
    }

    [Test]
    public async Task GenerateSlugWithMixedSpacesAndUnderscoresCollapsesToSingleHyphen()
    {
        SetupNoCollisions();

        var result = _sut.GenerateSlug("John _ Doe");

        await Assert.That(result).IsEqualTo("john-doe");
    }

    [Test]
    public async Task GenerateSlugWithSpecialCharactersRemovesThem()
    {
        SetupNoCollisions();

        var result = _sut.GenerateSlug("@John#Doe!");

        await Assert.That(result).IsEqualTo("johndoe");
    }

    [Test]
    public async Task GenerateSlugWithSpecialCharactersAndSpacesHandlesBoth()
    {
        SetupNoCollisions();

        var result = _sut.GenerateSlug("John @#$ Doe");

        await Assert.That(result).IsEqualTo("john-doe");
    }

    [Test]
    public async Task GenerateSlugWithNumbersPreservesThem()
    {
        SetupNoCollisions();

        var result = _sut.GenerateSlug("John123Doe");

        await Assert.That(result).IsEqualTo("john123doe");
    }

    [Test]
    public async Task GenerateSlugWithLeadingSpacesTrimsInput()
    {
        SetupNoCollisions();

        var result = _sut.GenerateSlug("  John Doe");

        await Assert.That(result).IsEqualTo("john-doe");
    }

    [Test]
    public async Task GenerateSlugWithTrailingSpacesTrimsInput()
    {
        SetupNoCollisions();

        var result = _sut.GenerateSlug("John Doe  ");

        await Assert.That(result).IsEqualTo("john-doe");
    }

    [Test]
    public async Task GenerateSlugWithLeadingHyphensRemovesThem()
    {
        SetupNoCollisions();

        var result = _sut.GenerateSlug("-John Doe");

        await Assert.That(result).IsEqualTo("john-doe");
    }

    [Test]
    public async Task GenerateSlugWithTrailingHyphensRemovesThem()
    {
        SetupNoCollisions();

        var result = _sut.GenerateSlug("John Doe-");

        await Assert.That(result).IsEqualTo("john-doe");
    }

    [Test]
    public async Task GenerateSlugWithLeadingAndTrailingHyphensRemovesBoth()
    {
        SetupNoCollisions();

        var result = _sut.GenerateSlug("---John Doe---");

        await Assert.That(result).IsEqualTo("john-doe");
    }

    [Test]
    public async Task GenerateSlugWithLeadingSpecialCharactersHandlesCorrectly()
    {
        SetupNoCollisions();

        var result = _sut.GenerateSlug("@#$John Doe");

        await Assert.That(result).IsEqualTo("john-doe");
    }

    [Test]
    public async Task GenerateSlugWithCollisionAppendsNumericSuffix()
    {
        SetupCollisionCount(1);

        var result = _sut.GenerateSlug("John Doe");

        await Assert.That(result).IsEqualTo("john-doe-1");
    }

    [Test]
    public async Task GenerateSlugWithMultipleCollisionsAppendsCorrectSuffix()
    {
        SetupCollisionCount(5);

        var result = _sut.GenerateSlug("John Doe");

        await Assert.That(result).IsEqualTo("john-doe-5");
    }

    [Test]
    public async Task GenerateSlugWithNoCollisionsReturnsBasicSlug()
    {
        SetupNoCollisions();

        var result = _sut.GenerateSlug("John Doe");

        await Assert.That(result).IsEqualTo("john-doe");
    }

    [Test]
    public async Task GenerateSlugWithRepositoryIdPassesIdToLookup()
    {
        var repositoryId = Guid.NewGuid();
        SetupNoCollisions();

        _sut.GenerateSlug("John Doe", repositoryId);

        A.CallTo(() => _repositoryLookup.CountBySlugPrefix("john-doe", repositoryId))
            .MustHaveHappenedOnceExactly();
    }

    [Test]
    public async Task GenerateSlugWithoutRepositoryIdPassesNullToLookup()
    {
        SetupNoCollisions();

        _sut.GenerateSlug("John Doe");

        A.CallTo(() => _repositoryLookup.CountBySlugPrefix("john-doe", null))
            .MustHaveHappenedOnceExactly();
    }

    private void SetupNoCollisions()
    {
        SetupCollisionCount(0);
    }

    private void SetupCollisionCount(int count)
    {
        A.CallTo(() => _repositoryLookup.CountBySlugPrefix(A<string>.Ignored, A<Guid?>.Ignored))
            .Returns(count);
    }
}
