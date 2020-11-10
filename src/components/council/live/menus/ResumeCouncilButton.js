import React from "react";
import { graphql, withApollo } from "react-apollo";
import { openCouncilRoom } from "../../../../queries/live";
import {
	AlertConfirm,
	BasicButton,
	Checkbox,
	Icon,
	Radio,
	HelpPopover
} from "../../../../displayComponents";
import { getPrimary } from "../../../../styles/colors";
import gql from "graphql-tag";


const ResumeCouncilButton = ({ council, translate, client, refetch }) => {
	const primary = getPrimary();

	const resumeCouncil = async () => {
		const response = await client.mutate({
            mutation: gql`
                mutation ResumeCouncil($councilId: Int!){
                    resumeCouncil(councilId: $councilId){
                        success
                    }
                }
            `,
            variables: {
                councilId: council.id
            }
        });
        refetch();

        console.log(response);
	}

	const getBody = () => {
		return (
			<React.Fragment>
				
			</React.Fragment>
		)
	}

	return (
		<>
            <BasicButton
                text={translate.resume}
                color={primary}
                fullWidth={true}
                onClick={resumeCouncil}
                textPosition="before"
                icon={
                    <Icon
                        className="material-icons"
                        style={{
                            fontSize: "1.1em",
                            color: "white"
                        }}
                    >
                        play_arrow
                    </Icon>
                }
                buttonStyle={{ width: "11em" }}
                textStyle={{
                    color: "white",
                    fontSize: "0.75em",
                    fontWeight: "700",
                    textTransform: "none"
                }}
            />
		</>
	);

}

export default withApollo(ResumeCouncilButton);