### AWS IP Updater
AWS Security Group Rule IP Updater

This repository contains a Node.js script that updates the description and allows access from the current public IP address in the specified AWS Security Group. The script fetches the current IP address from `httpbin.org` and uses the AWS SDK to update your security group rules with the current IP address, refer to the medium article how it will help you update your IP address automatically wherever you are. 

### Prerequisites

Before running the script, ensure that you have the following:

- Node.js installed on your machine
- install dependencies `npm install axios aws-sdk`
- AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables set with valid AWS credentials

### Usage

1. Clone this repository to your local machine.
2. Install the required dependencies by running `npm install axios aws-sdk`.
3. Run the script using the following command: `node aws-updates.js [tag]`.
   - Replace `[tag]` with the resource tag which you associated with your AWS Security Group Rules.
   - For example: `node aws-updates.js home`
4. The script will fetch your current public IP address and update the security group rules accordingly. The updated rules will allow access from your IP address.

### Notes
Ensure that your AWS IAM user has the necessary permissions to describe and modify security group rules.

The script fetches your current public IP address from httpbin.org.


### License
This project is licensed under the MIT License - see the LICENSE file for details.