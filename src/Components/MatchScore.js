import React from 'react';

const MatchScore = ({ promises, userNeeds }) => {
  // Function to calculate the match score between user needs and election promises
  const calculateScore = () => {
    if (!Array.isArray(promises)) {
      console.error("Invalid 'promises' array:", promises);
      return 0;
    }

    let matches = 0;

    // Iterate over each user need and compare with promises
    userNeeds.forEach((userNeed) => {
      userNeed.needs.forEach((need) => {
        promises.forEach((promise) => {
          if (need.trim().toLowerCase() === promise.promise.trim().toLowerCase()) {
            matches += 1;
          }
        });
      });
    });

    return matches;
  };

  const totalMatches = calculateScore();
  const totalNeeds = userNeeds.reduce((acc, userNeed) => acc + userNeed.needs.length, 0); // Total needs the user has
  const score = totalNeeds > 0 ? Math.round((totalMatches / totalNeeds) * 100) : 0; // Prevent division by zero and calculate score

  return (
    <div className="match-score">
      <p>Score: {score} / 100</p> {/* Display score as a percentage */}
    </div>
  );
};

export default MatchScore;
