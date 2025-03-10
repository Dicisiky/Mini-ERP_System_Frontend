import Penalty from "./Penalty";
import { FetchRentLineResponse } from "./RentLine";

// ############# What type of data is expected in form (in POST/PUT request) #############
type AppliedPenalty = {
  // '?' means that the field can be undefined, so it is not mandatory #############
  id?: number;
  //  ############# When making POST/PUT requests, it is enough to send the id of the Rent Line object #############
  rentLine: Pick<FetchRentLineResponse, "rentLineId">;
  //  ############# When making POST/PUT requests, it is enough to send the id of the Penalty object #############
  penalty: Pick<Penalty, "penaltyid">;
};

// ############# What type of data will be fetched from the backend #############
export type FetchAppliedPenalty = {
  id?: number;
  // ############# When fetching data, the response has a RentLine object #############
  rentLine: FetchRentLineResponse;
  // ############# When fetching data, the response has a Penalty object #############
  penalty: Penalty;
  // ############# all optional attributes (with '?') values will be populated by us after fetching data #############
  // ############# (they exist in Penalty/RentLine objects, but they are hard to access from the table) #############
  rentId?: number;
  customerName?: string;
  articleName?: string;
  penaltyDescription?: string;
  penaltyAmount?: number;
  rentLineId?: number;
};

export default AppliedPenalty;
