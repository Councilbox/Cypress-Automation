import React from "react";
import LiveUtil from "../../../utils/live";

const VotesTable = ({ agenda, translate }) => (
	<table className="table table-bordered">
		<thead style={{ backgroundColor: "rgb(249, 249, 249)" }}>
			<tr>
				<th className="">{translate.voting}</th>
				<th className="text-center" style={{ width: "22%" }}>
					{translate.in_favor}
				</th>
				<th className="text-center" style={{ width: "22%" }}>
					{translate.against}
				</th>
				<th className="text-center" style={{ width: "22%" }}>
					{translate.abstentions}
				</th>
				<th className="text-center" style={{ width: "22%" }}>
					{translate.no_vote}
				</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td className="text-center">{translate.remote_vote}</td>
				<td className="text-center">
					<span>
						{`${agenda.positive_votings} ${LiveUtil.parsePercentaje(
							agenda.positive_votings,
							agenda.current_remote_census + agenda.present_census
						)}%`}
					</span>
				</td>
				<td className="text-center">
					<span>
						{agenda.negative_votings} ({LiveUtil.parsePercentaje(
							agenda.negative_votings,
							agenda.current_remote_census + agenda.present_census
						)}%)
					</span>
				</td>
				<td className="text-center">
					<span>
						{agenda.abstention_votings} ({LiveUtil.parsePercentaje(
							agenda.abstention_votings,
							agenda.current_remote_census + agenda.present_census
						)}%)
					</span>
				</td>
				<td className="text-center">
					<span>
						{agenda.no_vote_votings} ({LiveUtil.parsePercentaje(
							agenda.no_vote_votings,
							agenda.current_remote_census + agenda.present_census
						)}%)
					</span>
				</td>
			</tr>
			<tr>
				<td className="">{translate.present_vote}</td>
				<td className=" text-center">
					<span>
						{agenda.positive_manual} ({LiveUtil.parsePercentaje(
							agenda.positive_manual,
							agenda.current_remote_census + agenda.present_census
						)}%)
					</span>
				</td>
				<td className=" text-center">
					<span>
						{agenda.negative_manual} ({LiveUtil.parsePercentaje(
							agenda.negative_manual,
							agenda.current_remote_census + agenda.present_census
						)}%)
					</span>
				</td>
				<td className=" text-center">
					<span>
						{agenda.abstention_manual} ({LiveUtil.parsePercentaje(
							agenda.abstention_manual,
							agenda.current_remote_census + agenda.present_census
						)}%)
					</span>
				</td>
				<td className=" text-center">
					<span>
						{agenda.no_vote_manual} ({LiveUtil.parsePercentaje(
							agenda.no_vote_manual,
							agenda.current_remote_census + agenda.present_census
						)}%)
					</span>
				</td>
			</tr>
			<tr>
				<td className="">Total</td>
				<td className=" text-center">
					{`${agenda.positive_votings +
						agenda.positive_manual}  ${LiveUtil.parsePercentaje(
						agenda.positive_votings + agenda.positive_manual,
						agenda.current_remote_census + agenda.present_census
					)}%`}
				</td>
				<td className=" text-center">
					{`${agenda.negative_votings +
						agenda.negative_manual} ${LiveUtil.parsePercentaje(
						agenda.negative_votings + agenda.negative_manual,
						agenda.current_remote_census + agenda.present_census
					)}%`}
				</td>
				<td className=" text-center">
					{`${agenda.abstention_votings +
						agenda.abstention_manual} ${LiveUtil.parsePercentaje(
						agenda.abstention_votings + agenda.abstention_manual,
						agenda.current_remote_census + agenda.present_census
					)}%`}
				</td>
				<td className=" text-center">
					{`${agenda.no_vote_votings +
						agenda.no_vote_manual} ${LiveUtil.parsePercentaje(
						agenda.no_vote_votings + agenda.no_vote_manual,
						agenda.current_remote_census + agenda.present_census
					)}%`}
				</td>
			</tr>
		</tbody>
	</table>
);

export default VotesTable;
