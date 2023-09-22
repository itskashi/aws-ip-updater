const axios = require('axios');
const AWS = require('aws-sdk');

// Check if a command-line argument is provided for tag-value
const tagValue = process.argv[2];

// Check if the tag-value argument is missing
if (!tagValue) {
  console.error('Example Usage: node aws-updates.js kk-home');
  process.exit(1);
}

// Set AWS credentials and region from environment variables
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1', // Use us-east-1 as the default region
});

const ec2 = new AWS.EC2();

// Get your current public IP address from httpbin.org
async function getCurrentIp() {
  try {
    const response = await axios.get('https://httpbin.org/ip');
    return response.data.origin;
  } catch (error) {
    console.error('Error fetching current IP:', error);
    process.exit(1);
  }
}

// Update security group rules
async function updateSecurityGroupRules() {
  const currentIp = await getCurrentIp();
  console.log('YOUR IP:', currentIp);

  const describeRulesParams = {
    Filters: [
      { Name: 'tag-key', Values: ['usage'] },
      { Name: 'tag-value', Values: [tagValue] }, // Use the provided tag-value argument
    ],
  };

  try {
    const describeRulesResponse = await ec2.describeSecurityGroupRules(describeRulesParams).promise();
    const securityGroupRules = describeRulesResponse.SecurityGroupRules || [];

    for (const rule of securityGroupRules) {
      const { GroupId, SecurityGroupRuleId, IpProtocol, FromPort, ToPort, Description } = rule;

      const ruleParams = {
        GroupId: GroupId,
        SecurityGroupRules: [
          {
            SecurityGroupRuleId,
            SecurityGroupRule: {
              IpProtocol,
              FromPort,
              ToPort,
              CidrIpv4: `${currentIp}/32`,
              Description,
            },
          },
        ],
      };

      await ec2.modifySecurityGroupRules(ruleParams).promise();
      console.log(`Updated rule ${SecurityGroupRuleId} description: ${Description} to allow access from ${currentIp} in security group ${GroupId}`);
    }
  } catch (error) {
    console.error('Error updating security group rules:', error);
    process.exit(1);
  }
}

// Run the script
updateSecurityGroupRules();
