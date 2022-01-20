import React from 'react';
import { withApollo } from 'react-apollo';
import { Card, IconButton } from 'material-ui';
import ContentEditable from 'react-contenteditable';
import { Scrollbar, DateTimePicker, BasicButton } from '../../../displayComponents';
import withTranslations from '../../../HOCs/withTranslations';
import { getPrimary } from '../../../styles/colors';


const FileLibrosOfi = ({
	translate, updateFileData, updateCompany, data, ...props
}) => {
	const primary = getPrimary();
	const books = (data.file && data.file.books) ? data.file.books : [];

	const addRow = () => {
		const newBooks = [...books, { aqui: 'otro' }];
		updateFileData({
			books: newBooks
		});
	};

	const deleteRow = index => {
		const newBooks = [...books];
		newBooks.splice(index, 1);
		updateFileData({
			books: newBooks
		});
	};

	const updateBook = (newData, index) => {
		const list = [...books];
		list[index] = {
			...list[index],
			...newData
		};

		updateFileData({
			books: [...list]
		});
	};

	return (
		<div style={{ height: '100%' }}>
			<div style={{ padding: '0px 1em 1em', height: '100%' }}>
				<div style={{ height: '100%' }}>
					<div style={{
						padding: '0 1em', fontWeight: 'bold', color: primary, display: 'flex', justifyContent: 'space-between', paddingLeft: '24px', paddingRight: '24px'
					}}>
						<div style={{ width: '15%', display: 'flex', cursor: 'pointer' }} onClick={addRow}>
							<div style={{ border: `1px solid${primary}`, padding: '0.6em 5px', display: 'flex' }}>
								{translate.act_book}
								<div>
									<i className="fa fa-plus-circle" style={{
										color: primary, paddingRight: '5px', marginLeft: '5px', fontSize: '16px'
									}}></i>
								</div>
							</div>
						</div>
						<div style={{ width: '12%', textAlign: 'center' }}>{translate.opening}</div>
						<div style={{ width: '12%', textAlign: 'center' }}>{translate.closing_date}</div>
						<div style={{ width: '12%', textAlign: 'center' }}>{translate.legalization_date}</div>
						<div style={{ width: '12%', textAlign: 'center' }}>{translate.devolution}</div>
						<div style={{ width: '15%', textAlign: 'center' }}>{translate.comments}</div>
					</div>
					<Scrollbar>
						<div style={{ width: '100%', height: 'calc( 100% - 3em )', padding: '0 1em' }}>
							{books.length > 0 ?
								books.map((book, index) => (
									<div key={`book_${index}`}>
										<Card style={{ marginTop: '1em' }}>
											<div style={{ position: 'relative' }}>
												<div style={{
													color: 'black', display: 'flex', justifyContent: 'space-between', fontSize: '15px', paddingLeft: '24px', paddingRight: '24px', paddingTop: '3em', paddingBottom: '3em'
												}}>
													<div style={{ width: '15%' }}>
														<ContentEditable
															style={{ color: 'black', minWidth: '10em' }}
															html={book.name || ''}
															onChange={event => {
																updateBook({
																	name: event.target.value
																}, index);
															}}
														/>

													</div>
													<div style={{ width: '12%' }}>
														<DateTimePicker
															format="L"
															onlyDate
															onChange={date => {
																let dateString = null;
																if (date) {
																	const newDate = new Date(date);
																	dateString = newDate.toISOString();
																}
																updateBook({
																	openDate: dateString
																}, index);
															}}
															acceptText={translate.save}
															value={book.openDate ? book.openDate : null}
														/>
													</div>
													<div style={{ width: '12%' }}>
														<DateTimePicker
															format="L"
															onlyDate
															onChange={date => {
																let dateString = null;
																if (date) {
																	const newDate = new Date(date);
																	dateString = newDate.toISOString();
																}
																updateBook({
																	closeDate: dateString
																}, index);
															}}

															value={book.closeDate ? book.closeDate : null}
														/>
													</div>
													<div style={{ width: '12%' }}>
														<DateTimePicker
															format="L"
															onlyDate
															onChange={date => {
																let dateString = null;
																if (date) {
																	const newDate = new Date(date);
																	dateString = newDate.toISOString();
																}
																updateBook({
																	legalDate: dateString
																}, index);
															}}

															value={book.legalDate ? book.legalDate : null}
														/>
													</div>
													<div style={{ width: '12%' }}>
														<DateTimePicker
															format="L"
															onlyDate
															onChange={date => {
																let dateString = null;
																if (date) {
																	const newDate = new Date(date);
																	dateString = newDate.toISOString();
																}
																updateBook({
																	devolutionDate: dateString
																}, index);
															}}

															value={book.devolutionDate ? book.devolutionDate : null}
														/>
													</div>
													<div style={{ width: '12%', display: 'flex' }}>
														<ContentEditable
															style={{ color: 'black', minWidth: '90%' }}
															html={book.comments || ''}
															onChange={event => {
																updateBook({
																	comments: event.target.value
																}, index);
															}}
														/>
														<IconButton
															onClick={() => deleteRow(index)}
															aria-label="Show more"
															className={'expandButtonModal'}
														>
															<i
																className={'fa fa-times-circle'}
																style={{
																	color: primary,
																	transition: 'all 0.3s'
																}}
															/>
														</IconButton>
													</div>
												</div>
											</div>
										</Card>
									</div>
								))
								: <div style={{ marginTop: '1em' }}>
									{translate.no_books_added}
								</div>

							}
							<BasicButton
								text={translate.save}
								color={primary}
								loading={props.updateState === 'LOADING'}
								success={props.updateState === 'SUCCESS'}
								textStyle={{
									color: 'white',
									fontWeight: '700',
									marginTop: '1em'
								}}
								onClick={updateCompany}
								floatRight={true}
							/>
						</div>

					</Scrollbar>
				</div>
			</div>
		</div>
	);
};


export default withTranslations()(withApollo(FileLibrosOfi));
