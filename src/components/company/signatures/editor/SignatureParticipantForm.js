import React from 'react';
import { MenuItem } from 'material-ui';
import { SelectInput, TextInput, Grid, GridItem } from '../../../../displayComponents';

const SignatureParticipantForm = ({ participant, translate, updateState, errors, languages }) => (
        <Grid>
            <GridItem xs={12} md={6} lg={6}>
                <TextInput
                    floatingText={translate.name}
                    type="text"
                    required
                    errorText={errors.name}
                    value={participant.name}
                    onChange={event => updateState({
                            name: event.nativeEvent.target.value
                        })
                    }
                />
            </GridItem>
            <GridItem xs={12} md={6} lg={6}>
                <TextInput
                    floatingText={translate.surname || ''}
                    type="text"
                    required
                    errorText={errors.surname || ''}
                    value={participant.surname || ''}
                    onChange={event => updateState({
                            surname: event.nativeEvent.target.value
                        })
                    }
                />
            </GridItem>
            <GridItem xs={12} md={6} lg={6}>
                <TextInput
					floatingText={translate.dni}
					type="text"
                    required
					errorText={errors.dni}
					value={participant.dni}
					onChange={event => updateState({
							dni: event.nativeEvent.target.value
						})
					}
				/>
            </GridItem>
            <GridItem xs={12} md={6} lg={6}>
                <TextInput
					floatingText={translate.position}
					type="text"
					errorText={errors.position}
					value={participant.position}
					onChange={event => updateState({
							position: event.nativeEvent.target.value
						})
					}
				/>
            </GridItem>
            <GridItem xs={12} md={6} lg={6}>
                <TextInput
					floatingText={translate.email}
					type="text"
                    required
					errorText={errors.email}
					value={participant.email}
					onChange={event => updateState({
							email: event.nativeEvent.target.value
						})
					}
				/>
            </GridItem>
            <GridItem xs={12} md={6} lg={6}>
                <TextInput
					floatingText={translate.phone}
					type="text"
					errorText={errors.phone}
					value={participant.phone}
					onChange={event => updateState({
							phone: event.nativeEvent.target.value
						})
					}
				/>
            </GridItem>
            <GridItem xs={12} md={6} lg={6}>
                <SelectInput
					floatingText={translate.language}
					value={participant.language}
					onChange={event => updateState({
							language: event.target.value
						})
					}
				>
					{languages.map(language => (
							<MenuItem
								value={
									language.columnName ?
										language.columnName
										: language.column_name
								}
								key={`language_${
									language.columnName ?
										language.columnName
										: language.column_name
								}`}
							>
								{language.desc}
							</MenuItem>
						))}
				</SelectInput>
            </GridItem>
        </Grid>
    );

export default SignatureParticipantForm;
